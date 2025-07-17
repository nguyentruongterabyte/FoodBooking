package com.foodbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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

}
