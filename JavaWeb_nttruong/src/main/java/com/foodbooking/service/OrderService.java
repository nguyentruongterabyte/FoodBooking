package com.foodbooking.service;

import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.entity.Order;

public interface OrderService {
	/**
	 * Create new order
	 * 
	 * @param order order sent from client
	 */
	public void saveOrder(OrderRequestDTO order);

	/**
	 * Find the order by id
	 * 
	 * @param id id from client
	 * @return found order
	 */
	public Order findByOrderId(Long id);
}
