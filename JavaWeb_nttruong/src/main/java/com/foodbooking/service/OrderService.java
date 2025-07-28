package com.foodbooking.service;

import java.util.List;

import com.foodbooking.dto.RevenueDTO;
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
	
	/**
	 * Get today's sale
	 * 
	 * @return (totalPrice + shipping fee)
	 */
	public Long getTodaySales();
	
	/**
	 * Get quantity of order today
	 * 
	 * @param orderStatusId NEW 1, SHIPPING 2, COMPLETED 4, CANCELLED 3
	 * @return
	 */
	public Integer getCountToday(Long orderStatusId);
	
	/**
	 * Get list of orders pagination
	 * 
	 * @param dateType ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword search by booking product name
	 * @param limit item per page
	 * @param offset offset
	 * @return list of orders
	 */
	public List<Order> findOrdersPage(
			String dateType,
			List<Long> orderStatusIds,
			String keyword,
			Integer limit,
			Integer offset
	);
	
	/**
	 * Get count of orders
	 * 
	 * @param dateType ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword search by booking product name
	 * @return count of order
	 */
	public Integer getCount(
			String dateType,
			List<Long> orderStatusIds,
			String keyword	
	);
	
	/**
	 * Update order information
	 * 
	 * @param order order request
	 * @return row effected
	 */
	public Integer updateOrder(OrderRequestDTO order);
	
	/**
	 * Get the revenue of last 7 days
	 * 
	 * @return List of period, revenue
	 */
	public List<RevenueDTO> getLast7DaysRevenue();
	
	/**
	 * Get the revenue of last 12 weeks
	 * 
	 * @return List of period, revenue
	 */
	public List<RevenueDTO> getLast12WeeksRevenue();
	
	/**
	 * Get the revenue of last 12 months
	 * 
	 * @return List of period, revenue
	 */
	public List<RevenueDTO> getLast12MonthsRevenue();
}
