package com.foodbooking.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderDetail;
import com.foodbooking.entity.OrderStatusEnum;
import com.foodbooking.entity.Ward;
import com.foodbooking.repository.BookingProductRepository;
import com.foodbooking.repository.OrderRepository;
import com.foodbooking.service.OrderService;
import com.foodbooking.service.ProvinceService;
import com.foodbooking.service.WardService;
import com.foodbooking.utils.DateFormatter;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private BookingProductRepository bookingProductRepository;

	@Autowired
	private ProvinceService provinceService;

	@Autowired
	private WardService wardService;

	/**
	 * Create new order
	 * 
	 * @param order order sent from client
	 */
	@Override
	public void saveOrder(OrderRequestDTO order) {
		try {

			// Check exists province, ward
			if (provinceService.findByProviceId(order.getProvinceId()) == null)
				throw new ErrorResponse(HttpStatus.NOT_FOUND,
						"The province with id " + order.getProvinceId() + " not found.");
			Ward existWard = wardService.findByWardId(order.getWardId());
			if (existWard == null)
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "The ward with id " + order.getWardId() + " not found.");

			// Set shipping fee
			order.setShippingFee(existWard.getShippingFee());
			
			// Check if the booking product empty
			List<OrderDetail> bookingProducts = order.getBookingProducts();
			if (bookingProducts == null || bookingProducts.isEmpty())
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "The booking product is empty.");
			
			Long totalPrice = 0L;
			
			// Check exists products
			for (OrderDetail bookingProduct : bookingProducts) {
				BookingProduct existProduct = 
						bookingProductRepository.findByBookingProductId(bookingProduct.getBookingProductId());
				// Throw error if not found
				if (existProduct == null)
					throw new ErrorResponse(HttpStatus.NOT_FOUND,
							"The product with id " + bookingProduct.getBookingProductId() + " not found.");
				int itemQuantity = bookingProduct.getQuantity(); // Item quantity
				Long itemPrice = existProduct.getPrice(); // Item price
				bookingProduct.setItemPrice(itemPrice); // Set item price
				// Calculate total price
				totalPrice += (itemQuantity * itemPrice);
			}

			// Set total price
			order.setTotalPrice(totalPrice);
			
			// Set created at now
			order.setCreatedAt(LocalDateTime.now());

			order.setOrderStatusId(OrderStatusEnum.NEW.getId()); // New status 
			
			orderRepository.saveOrder(order);

			// Get the order id
			Long orderId = order.getId();

			// Save order details
			orderRepository.saveOrderDetails(orderId, bookingProducts);

		} catch (Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * Find the order by id
	 * 
	 * @param id id from client
	 * @return found order
	 */
	@Override
	public Order findByOrderId(Long id) {
		Order foundOrder = orderRepository.findByOrderId(id);
		// Check if not found
		if (foundOrder == null)
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The order not found");
		foundOrder.setCreatedAtStr(DateFormatter.formatDate(foundOrder.getCreatedAt()));

		return foundOrder;
	}

	


	/**
	 * Get today's sale
	 * 
	 * @return (totalPrice + shipping fee)
	 */
	@Override
	public Long getTodaySales() {
		Long todaySales = orderRepository.getTodaySales();
	
		return todaySales == null ? 0 : todaySales;
	}

	/**
	 * Get quantity of order today
	 * 
	 * @param orderStatusId NEW 1, SHIPPING 2, COMPLETED 4, CANCELLED 3
	 * @return
	 */
	@Override
	public Integer getCountToday(Long orderStatusId) {
		return orderRepository.getCountToday(orderStatusId);
	}

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
	@Override
	public List<Order> findOrdersPage(String dateType, List<Long> orderStatusIds, String keyword,
			Integer limit, Integer offset) {
		
		List<Order> orders = new ArrayList<>();
		
		switch (dateType.toLowerCase()) {
		case "today": { // Find orders from today to tomorrow
			LocalDate today = LocalDate.now();
			LocalDate tomorrow = today.plusDays(1);
			orders = orderRepository.findOrdersPage(today, tomorrow, orderStatusIds, keyword, limit, offset);
			break;
		}
		case "week": { // Find orders from first day of week to last day of week (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
			LocalDate lastDayOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
			orders = orderRepository.findOrdersPage(firstDayOfWeek, lastDayOfWeek, orderStatusIds, keyword, limit, offset);
			break;
		}
		case "month": { // Find orders from first day of month to last day of month (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
			LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
			orders = orderRepository.findOrdersPage(firstDayOfMonth, lastDayOfMonth, orderStatusIds, keyword, limit, offset);
		}
			break;
		case "all":
		default: // Find all orders
			orders = orderRepository.findOrdersPage(null, null, orderStatusIds, keyword, limit, offset);
			
		}
		
		// Check empty list
		if (orders == null || orders.isEmpty())
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The list of order is empty.");
		
		for (Order order : orders) {
			order.setCreatedAtStr(DateFormatter.formatDate(order.getCreatedAt()));
		}
		
		return orders;
	}

	/**
	 * Get count of orders
	 * 
	 * @param dateType ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword search by booking product name
	 * @return count of order
	 */
	@Override
	public Integer getCount(String dateType, List<Long> orderStatusIds, String keyword) {
		int count = 0;
		
		switch (dateType.toLowerCase()) {
		case "today": { // Count orders from today to tomorrow
			LocalDate today = LocalDate.now();
			LocalDate tomorrow = today.plusDays(1);
			count = orderRepository.getCount(today, tomorrow, orderStatusIds, keyword);
			break;
		}
		case "week": { // Count orders from first day of week to last day of week (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
			LocalDate lastDayOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
			count = orderRepository.getCount(firstDayOfWeek, lastDayOfWeek, orderStatusIds, keyword);
			break;
		}
		case "month": { // Count orders from first day of month to last day of month (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
			LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
			count = orderRepository.getCount(firstDayOfMonth, lastDayOfMonth, orderStatusIds, keyword);
		}
			break;
		case "all":
		default: // get count all of orders
			count = orderRepository.getCount(null, null, orderStatusIds, keyword);
		}
		
		return count;
	}
}
