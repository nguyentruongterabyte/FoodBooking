package com.foodbooking.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.repository.BookingProductRepository;
import com.foodbooking.service.BookingProductService;
import com.foodbooking.service.FileStorageService;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
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
public class BookingProductServiceImpl implements BookingProductService {

	@Autowired
	private BookingProductRepository bookingProductRepository;
	
	@Autowired
	private FileStorageService fileStorageService;
	
	@Autowired
	private ElasticsearchOperations elasticsearchOperations;
	
	@Autowired
	private ElasticsearchClient elasticsearchClient;

	/**
	 * save new booking product
	 * 
	 * @param bookingProduct booking product data
	 */
	@Override
	public void saveBookingProduct(BookingProduct bookingProduct) {

		// Check if name duplicate
		boolean isExistsByNameInType = bookingProductRepository.existsByNameInType(bookingProduct.getName(),
				bookingProduct.getType());

		if (isExistsByNameInType)
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate name '" + bookingProduct.getName() + "'");
		try {
			bookingProductRepository.saveBookingProduct(bookingProduct);
			elasticsearchOperations.save(bookingProduct); // Save with elastic search
		} catch (Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * @param isDeleted null: get by admin, false: get by customer
	 * @param offset    offset = page * limit
	 * @param limit     the size of item per page
	 * @return list of booking products (pagination)
	 */
	@Override
	public List<BookingProduct> findBookingProductsPage(
			String keyword,
			Boolean isDeleted,
			String type,
			Boolean priceDESC,
			Integer offset,
			Integer limit) {
		if (keyword == null || keyword.isBlank()) {
			List<BookingProduct> bookingProducts = bookingProductRepository
					.findBookingProductsPage(keyword, isDeleted, type, priceDESC, offset, limit);

			if (bookingProducts == null || bookingProducts.isEmpty()) {
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "The list of product booking is empty.");
			}
			return bookingProducts;
		}
		
		// Search by elastic search
		try {
			
			BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
			
			// keyword: find in name or description
			boolQueryBuilder.must(s -> s.multiMatch(m -> m
					.fields("name", "description")
					.query(keyword)
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
		catch(Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Elasticsearch error: " + e.getMessage());
		}
	}

	/**
	 * 
	 * Get total of items of booking products
	 * 
	 * @param keyword search by name
	 * @param isDeleted null admin, false customer
	 * @param type food/drink
	 * @return total of items
	 */
	@Override
	public Integer getCount(String keyword, Boolean isDeleted, String type) {
		if (keyword != null && !keyword.isBlank()) {
			// Count by Elastic search
			return countByElasticsearch(keyword, isDeleted, type);
		} else {
			// Count by MyBatis
			return bookingProductRepository.getCount(keyword, isDeleted, type);
		}
	}

	/**
	 * Update booking product
	 * 
	 * @param bookingProduct booking product from request
	 * @return row effected
	 */
	@Override
	public Integer updateBookingProduct(BookingProduct bookingProduct) {
		
		// Check if id null
		if (bookingProduct.getId() == null) 
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please provide booking product id");
		
		// Check if booking product not found
		BookingProduct existProduct = findByBookingProductId(bookingProduct.getId());
		
		// Only update available attributes 
		if (bookingProduct.getType() != null) {
			existProduct.setType(bookingProduct.getType());
		}
		
		if (bookingProduct.getName() != null) {
			existProduct.setName(bookingProduct.getName());
		}
		
		if (bookingProduct.getDescription() != null) {
			existProduct.setDescription(bookingProduct.getDescription());;
		}
		
		if (bookingProduct.getImageUrl() != null) {
			// Delete old file from uploads folder
			String oldImageUrl = existProduct.getImageUrl();
			fileStorageService.deleteFile(oldImageUrl);
			existProduct.setImageUrl(bookingProduct.getImageUrl());
		}
		
		if (bookingProduct.getPrice() != null) {
			existProduct.setPrice(bookingProduct.getPrice());
		}
		
		if (bookingProduct.getIsDeleted() != null) {
			existProduct.setIsDeleted(bookingProduct.getIsDeleted());
		}
		
		int rowEffected = bookingProductRepository.updateBookingProduct(existProduct);
		
		try {
			elasticsearchOperations.save(existProduct);
			elasticsearchOperations.indexOps(BookingProduct.class).refresh();
		} catch (Exception e) {
			e.printStackTrace();
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
					"Failed to index product into Elasticsearch: " + e.getMessage());
		}
		
		return rowEffected;
	}

	/**
	 * Find booking product by id
	 * 
	 * @param id id of booking product want to find
	 * @return found booking product
	 */
	@Override
	public BookingProduct findByBookingProductId(Long id) {
		// Check if booking product not found
		BookingProduct existProduct = bookingProductRepository.findByBookingProductId(id);
		if (existProduct == null) 
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "Booking product with id '" + id + "' not found!");
		
		return existProduct;
	}
	
	private Integer countByElasticsearch(String keyword, Boolean isDeleted, String type) {
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
		
		CountRequest countRequest = new CountRequest.Builder()
				.index("booking_products")
				.query(q -> q.bool(boolQueryBuilder.build()))
				.build();
		
		try {
			CountResponse countResponse = elasticsearchClient.count(countRequest);
			return (int) countResponse.count();
		} catch (IOException e) {
			e.printStackTrace();
			return 0;
		}
	}
}
