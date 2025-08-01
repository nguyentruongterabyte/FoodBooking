package com.foodbooking.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.repository.BookingProductElasticSearchRepository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch.core.CountRequest;
import co.elastic.clients.elasticsearch.core.CountResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

@Service
public class BookingProductElasticSearchService {
	private Logger logger = LoggerFactory.getLogger(BookingProductElasticSearchService.class);

	@Value("${openai.token}")
	private String openAIKey;

	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private ElasticsearchClient elasticsearchClient;
	
	@Autowired
	private BookingProductElasticSearchRepository bookingProductElasticSearchRepository;

	public List<Double> getSimilarityScores(String sourceSentence, List<String> sentences) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(openAIKey); // Hugging Face token
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

		RestTemplate restTemplate = new RestTemplate();

		Map<String, Object> inputMap = new HashMap<>();
		inputMap.put("source_sentence", sourceSentence);
		inputMap.put("sentences", sentences);

		Map<String, Object> payload = new HashMap<>();
		payload.put("inputs", inputMap);

		String body;
		try {
			body = objectMapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			logger.error("JSON error", e);
			return null;
		}

		HttpEntity<String> request = new HttpEntity<>(body, headers);

		try {
			ResponseEntity<String> response = restTemplate.postForEntity(
					"https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity",
					request, String.class);

			if (response.getStatusCode() == HttpStatus.OK) {
				return objectMapper.readValue(response.getBody(), new TypeReference<List<Double>>() {
				});
			} else {
				logger.error("HF API response: {}", response.getStatusCode());
			}

		} catch (Exception e) {
			logger.error("HF API call failed", e);
		}

		return null;
	}
	
	public List<BookingProduct> searchSemanticBookingProduct(String keyword, String type, Boolean isDeleted, Boolean priceDESC, Integer offset, Integer limit) {
		// 1. Lấy danh sách sản phẩm theo filter
		List<BookingProduct> filteredProducts = new ArrayList<>();
		for (BookingProduct product : bookingProductElasticSearchRepository.findAll()) {
			if ((type == null || type.equalsIgnoreCase(product.getType()))
					&& (isDeleted == null || isDeleted.equals(product.getIsDeleted()))) {
				filteredProducts.add(product);
			}
		}

		if (filteredProducts.isEmpty()) {
			return new ArrayList<>();
		}

		// 2. Tạo câu name + description
		List<String> sentences = new ArrayList<>();
		for (BookingProduct p : filteredProducts) {
			sentences.add(p.getName().trim()); // bạn có thể nối description nếu muốn
		}

		// 3. Tính similarity với từ khóa
		List<Double> scores = getSimilarityScores(keyword, sentences);
		if (scores == null || scores.size() != filteredProducts.size()) {
			throw new RuntimeException("Lỗi khi tính similarity từ Hugging Face");
		}

		System.out.println("fjsdklfds: " + scores);

		// 4. Gắn điểm và sort theo độ tương đồng giảm dần
		List<Map.Entry<BookingProduct, Double>> scoredProducts = new ArrayList<>();
		for (int i = 0; i < filteredProducts.size(); i++) {
			double score = scores.get(i);
			scoredProducts.add(Map.entry(filteredProducts.get(i), score));
			
		}

		// Sort thủ công theo điểm giảm dần
		scoredProducts.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

		// 5. Phân trang
		int from = Math.min(offset, scoredProducts.size());
		int to = Math.min(offset + limit, scoredProducts.size());

		List<BookingProduct> result = new ArrayList<>();
		for (int i = from; i < to; i++) {
			result.add(scoredProducts.get(i).getKey());
		}

		return result;
	}
	
	public List<BookingProduct> searchBookingProducts(String keyword, String type, Boolean isDeleted, Boolean priceDESC, Integer offset, Integer limit) throws ElasticsearchException, IOException {
		BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
		
		// keyword: find in name or description
		boolQueryBuilder.filter(s -> s.multiMatch(m -> m
				.fields("name", "description")
				.query(keyword)
				.operator(Operator.And)
				.fuzziness("AUTO")
			)
		);
		// Type
		if (type != null) {
			boolQueryBuilder.must(s -> s.match(m -> m.field("type").query(type)));
		}
		
		// is deleted
		if (isDeleted != null) {
			boolQueryBuilder.must(m -> m.match(t -> t.field("isDeleted").query(isDeleted)));
		}
		
		// Determine order sorted
		SortOptions sortOptions;
		
		if (priceDESC == null) {
			// Default: sort by id DESC (like SQL ORDER BY id DESC)
			sortOptions = SortOptions.of(s -> s.field(f -> f.field("id").order(SortOrder.Desc)));
		} else {
			// Sort by price
			sortOptions = SortOptions.of(s -> s.field(f -> f.field("price").order(
					priceDESC ? SortOrder.Desc : SortOrder.Asc
			)));
		}
		
		// Create query search
		SearchRequest request = new SearchRequest.Builder()
				.index("booking_products")
				.query(q -> q.bool(boolQueryBuilder.build()))
				.sort(sortOptions)
				.from(offset)
				.size(limit)
				.build();
		
		// Send query
		SearchResponse<BookingProduct> response = elasticsearchClient.search(request, BookingProduct.class);
		
		// Return result
		List<BookingProduct> result = new ArrayList<>();
		for (Hit<BookingProduct> hit : response.hits().hits()) {
			BookingProduct bookingProduct = hit.source();
			if (bookingProduct != null)
				result.add(bookingProduct);
		}
		
		return result;
	}
	
	public Integer countByElasticsearch(String keyword, Boolean isDeleted, String type) {
		BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

		// keyword: find in name or description
		boolQueryBuilder.filter(s -> s.multiMatch(
				m -> m
				.fields("name", "description")
				.query(keyword)
				.operator(Operator.And)
				.fuzziness("AUTO")));
		// Type
		if (type != null) {
			boolQueryBuilder.must(s -> s.match(m -> m.field("type").query(type)));
		}

		// is deleted
		if (isDeleted != null) {
			boolQueryBuilder.must(m -> m.match(t -> t.field("isDeleted").query(isDeleted)));
		}

		CountRequest countRequest = new CountRequest.Builder().index("booking_products")
				.query(q -> q.bool(boolQueryBuilder.build())).build();

		try {
			CountResponse countResponse = elasticsearchClient.count(countRequest);
			return (int) countResponse.count();
		} catch (IOException e) {
			e.printStackTrace();
			return 0;
		}
	}
}
