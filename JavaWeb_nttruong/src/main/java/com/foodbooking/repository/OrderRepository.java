package com.foodbooking.repository;

import java.time.LocalDate;
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
	public Long getSales(
			LocalDate startDay, LocalDate endDate
	);
	public Integer getCountToday(Long orderStatusId);
	
	public List<Order> findOrdersPage(
			LocalDate startDay,
			LocalDate endDay,
			List<Long> orderStatusIds,
			String keyword,
			Integer limit,
			Integer offset
	);
	
	public Integer getCount(
			LocalDate startDay,
			LocalDate endDay,
			List<Long> orderStatusIds,
			String keyword
	);
	
	public Integer updateOrder(OrderRequestDTO order);
}
