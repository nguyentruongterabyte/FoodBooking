package com.foodbooking.dto.response;

import com.foodbooking.entity.OrderStatus;

import lombok.Data;

@Data
public class OrderMessage {
	private Long orderId;
	private String customerName;
	private OrderStatus orderStatus;
}
