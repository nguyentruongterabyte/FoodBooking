package com.foodbooking.controller.impl;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.OrderController;
import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.entity.Order;
import com.foodbooking.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/orders")
public class OrderControllerImpl implements OrderController{
	private final OrderService orderService;

	public OrderControllerImpl(OrderService orderService) {
		this.orderService = orderService;
	}

	/**
	 * API get order by id
	 * 
	 * @param id from request
	 * @return order information
	 */
	@Override
	@GetMapping("/{id}")
	public ResponseEntity<?> getByOrderId(@PathVariable Long id) {
		Order foundOrder = orderService.findByOrderId(id);
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(foundOrder)
						.build()
				);
	}

	/**
	 * API create order
	 * 
	 * @param order from request
	 * @return new order information
	 */
	@Override
	@PostMapping("")
	public ResponseEntity<?> saveOrder(@Valid @RequestBody OrderRequestDTO order) {
		
		// save order
		orderService.saveOrder(order);
		
		// Get new order information
		Order newOrder = orderService.findByOrderId(order.getId());
		// Return response
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(ApiResponse.builder()
						.status(HttpStatus.CREATED.value())
						.timestamp(LocalDateTime.now())
						.message("Created successfully!")
						.data(newOrder)
						.build()
				);
	}
	
}
