package com.foodbooking.mapper;

import java.time.LocalDate;
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
	public Long getTodaySales();
	public Integer getCountToday(Long orderStatusId);
	
	public List<Order> findOrdersPage(
			@Param("startDay") LocalDate startDay,
			@Param("endDay") LocalDate endDay,
			@Param("orderStatusIds") List<Long> orderStatusIds,
			@Param("keyword") String keyword,
			@Param("limit") Integer limit,
			@Param("offset") Integer offset
	);
	
	public Integer getCount(
			@Param("startDay") LocalDate startDay,
			@Param("endDay") LocalDate endDay,
			@Param("orderStatusIds") List<Long> orderStatusIds,
			@Param("keyword") String keyword
	);
	
}
