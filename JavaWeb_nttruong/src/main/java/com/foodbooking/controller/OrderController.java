package com.foodbooking.controller;

import java.util.List;

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

	/**
	 * API Get today's sale
	 * 
	 * @return (totalPrice + shipping fee)
	 */
	ResponseEntity<?> getTodaySales();

	/**
	 * API Get quantity of order today
	 * 
	 * @param orderStatusId NEW 1, SHIPPING 2, COMPLETED 4, CANCELLED 3
	 * @return
	 */
	ResponseEntity<?> getCountToday(Long orderStatusId);

	/**
	 * API Get list of orders pagination
	 * 
	 * @param dateType       ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword        search by booking product name
	 * @param limit          item per page
	 * @param offset         offset
	 * @return list of orders
	 */
	ResponseEntity<?> getOrdersPage(
			String dateType, 
			List<Long> orderStatusIds, 
			String keyword, 
			Boolean includeTotal, 
			Integer size,
			Integer page
	);

	/**
	 * API Get count of orders
	 * 
	 * @param dateType       ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword        search by booking product name
	 * @return count of order
	 */
	ResponseEntity<?> getCount(String dateType, List<Long> orderStatusIds, String keyword);
	
	/**
	 * API Update order status
	 * 
	 * @param orderId  order id
	 * @param statusId new status
	 * @return
	 */
	ResponseEntity<?> updateOrderStatus(
			Long orderId,
			Long statusId
	);
	
	/**
	 * API Get revenue day|week|month
	 * 
	 * @param type day|week|month
	 * @return API list of revenue
	 */
	ResponseEntity<?> getRevenue(String type);
	
}
