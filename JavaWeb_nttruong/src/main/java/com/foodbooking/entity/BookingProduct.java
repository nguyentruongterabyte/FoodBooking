package com.foodbooking.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "booking_products", createIndex = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingProduct {

	@Id
	private Long id;

	private String type;

	private String name;

	private String description;

	private Long price;

	private String imageUrl;

	private Boolean isDeleted;
}
