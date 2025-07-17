package com.foodbooking.controller;

import org.springframework.http.ResponseEntity;

import com.foodbooking.dto.request.OrderRequestDTO;


public interface OrderController {
	/**
	 * API get order by id
	 * 
	 * @param id from request
	 * @return order information
	 */
	ResponseEntity<?> getByOrderId(Long id);
	
	/**
	 * API create order
	 * 
	 * @param order from request
	 * @return new order information
	 */
	ResponseEntity<?> saveOrder(OrderRequestDTO order);
}
