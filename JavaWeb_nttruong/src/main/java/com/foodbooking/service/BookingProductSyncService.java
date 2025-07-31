package com.foodbooking.service;



import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodbooking.entity.BookingProduct;
import com.foodbooking.repository.BookingProductRepository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import jakarta.annotation.PostConstruct;

@Service
public class BookingProductSyncService {
	@Autowired
	private BookingProductRepository bookingProductRepository;
	
	@Autowired
	private ElasticsearchClient elasticsearchClient;
	
	@PostConstruct
	public void syncAllBookingProducts() {
		List<BookingProduct> allProducts = bookingProductRepository.findAllBookingProducts();
		
		if (allProducts == null || allProducts.isEmpty())
			return;
		
		BulkRequest.Builder br = new BulkRequest.Builder();
		
		for (BookingProduct product : allProducts) {
			br.operations(op -> op
				.index(idx -> idx
					.index("booking_products")
					.id(product.getId().toString())
					.document(product)
				)
			);
		}
		
		try {
			elasticsearchClient.bulk(br.build());
			System.out.println("Sync completed: " + allProducts.size() + " products");
		} catch (IOException e) {
			throw new RuntimeException("Bulk sync error: " + e.getMessage(), e);
		}
	}
}
