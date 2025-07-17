package com.foodbooking.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderDetail;

@Mapper
public interface OrderMapper {
	public void saveOrder(OrderRequestDTO order);
	public void saveOrderDetails(
			@Param("orderId") Long orderId, 
			@Param("bookingProducts") List<OrderDetail> bookingProducts
	);
	
	public Order findByOrderId(Long id);
}
