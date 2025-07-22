package com.foodbooking.entity;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class Order {

	private Long id;

	private String name;

	private String phone;

	private String detailAddress;

	private String message;

	private Long shippingFee;

	private Long totalPrice;

	private Ward ward;

	private Province province;

	private List<OrderDetail> bookingProducts;

	private OrderStatus orderStatus;
	
	private OrderStatus cancelledAtStatus;

	private LocalDateTime createdAt;
	
	private String createdAtStr;
}
