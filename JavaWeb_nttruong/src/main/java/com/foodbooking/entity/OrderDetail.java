package com.foodbooking.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDetail {
	private Long orderId;
	private Long bookingProductId;
	private Integer quantity;
	private Long itemPrice;
	private String name;
	private String description;
}
