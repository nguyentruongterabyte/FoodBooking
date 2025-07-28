package com.foodbooking.repository.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodbooking.dto.RevenueDTO;
import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderDetail;
import com.foodbooking.mapper.OrderMapper;
import com.foodbooking.repository.OrderRepository;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

	@Autowired
	private OrderMapper orderMapper;


	@Override
	public void saveOrder(OrderRequestDTO order) {
		orderMapper.saveOrder(order);
	}

	@Override
	public void saveOrderDetails(Long orderId, List<OrderDetail> bookingProducts) {
		orderMapper.saveOrderDetails(orderId, bookingProducts);
	}

	@Override
	public Order findByOrderId(Long id) {
		return orderMapper.findByOrderId(id);
	}

	@Override
	public Long getSales(LocalDate startDay, LocalDate endDay) {
		return orderMapper.getSales(startDay, endDay);
	}

	@Override
	public Integer getCountToday(Long orderStatusId) {
		return orderMapper.getCountToday(orderStatusId);
	}

	@Override
	public List<Order> findOrdersPage(LocalDate startDay, LocalDate endDay, List<Long> orderStatusIds, String keyword,
			Integer limit, Integer offset) {
		return orderMapper.findOrdersPage(startDay, endDay, orderStatusIds, keyword, limit, offset);
	}

	@Override
	public Integer getCount(LocalDate startDay, LocalDate endDay, List<Long> orderStatusIds, String keyword) {
		return orderMapper.getCount(startDay, endDay, orderStatusIds, keyword);
	}

	@Override
	public Integer updateOrder(OrderRequestDTO order) {
		return orderMapper.updateOrder(order);
	}

	@Override
	public List<RevenueDTO> getSalesGroupedBy(String format, LocalDateTime startDay, LocalDateTime endDay) {
		return orderMapper.getSalesGroupedBy(format, startDay, endDay);
	}

}
