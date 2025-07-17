package com.foodbooking.repository;

import java.util.List;

import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderDetail;

public interface OrderRepository {
	public void saveOrder(OrderRequestDTO order);
	public void saveOrderDetails(
			Long orderId, 
			List<OrderDetail> bookingProducts
	);
	public Order findByOrderId(Long id);
}
