package com.foodbooking.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.foodbooking.entity.BookingProduct;



public interface BookingProductElasticSearchRepository extends ElasticsearchRepository <BookingProduct, Long>{
	Page<BookingProduct> findByTypeAndIsDeleted(String type, Boolean isDeleted, Pageable pageable);
	Page<BookingProduct> findByType(String type, Pageable pageable);
	Page<BookingProduct> findByIsDeleted(Boolean isDeleted, Pageable pageable);
	
}
