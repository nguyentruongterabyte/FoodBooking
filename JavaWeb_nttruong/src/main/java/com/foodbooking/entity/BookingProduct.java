package com.foodbooking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingProduct {

	private Long id;

	private String type;

	private String name;

	private String description;

	private Long price;

	private String imageUrl;

	private Boolean isDeleted;
}
