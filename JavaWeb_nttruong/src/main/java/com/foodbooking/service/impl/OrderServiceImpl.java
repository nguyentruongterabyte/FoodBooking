package com.foodbooking.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.RevenueDTO;
import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderDetail;
import com.foodbooking.entity.OrderStatus;
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
				BookingProduct existProduct = bookingProductRepository
						.findByBookingProductId(bookingProduct.getBookingProductId());
				// Throw error if not found
				if (existProduct == null)
					throw new ErrorResponse(HttpStatus.NOT_FOUND,
							"The product with id " + bookingProduct.getBookingProductId() + " not found.");
				int itemQuantity = bookingProduct.getQuantity(); // Item quantity
				
				// Check invalid quantity
				if (itemQuantity <= 0 || itemQuantity > 3) {
					throw new ErrorResponse(HttpStatus.BAD_REQUEST,
							"Invalid quantity: " + itemQuantity 
					);
				}
				
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
		LocalDate today = LocalDate.now();
		LocalDate tomorrow = today.plusDays(1);
		Long todaySales = orderRepository.getSales(today, tomorrow);
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

		LocalDate today = LocalDate.now();
		LocalDate tomorrow = today.plusDays(1);
		List<Long> orderStatusIds = new ArrayList<>();
		orderStatusIds.add(orderStatusId);

		return orderRepository.getCount(today, tomorrow, orderStatusIds, null);
	}

	/**
	 * Get list of orders pagination
	 * 
	 * @param dateType       ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword        search by booking product name
	 * @param limit          item per page
	 * @param offset         offset
	 * @return list of orders
	 */
	@Override
	public List<Order> findOrdersPage(String dateType, List<Long> orderStatusIds, String keyword, Integer limit,
			Integer offset) {

		List<Order> orders = new ArrayList<>();

		switch (dateType.toLowerCase()) {
		case "today": { // Find orders from today to tomorrow
			LocalDate today = LocalDate.now();
			LocalDate tomorrow = today.plusDays(1);
			orders = orderRepository.findOrdersPage(today, tomorrow, orderStatusIds, keyword, limit, offset);
			// Check empty list
			if (orders == null || orders.isEmpty())
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "Oops! It looks like you don't have any orders today.");
			break;
		}
		case "week": { // Find orders from first day of week to last day of week (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
			LocalDate lastDayOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
			orders = orderRepository.findOrdersPage(firstDayOfWeek, lastDayOfWeek, orderStatusIds, keyword, limit,
					offset);
			// Check empty list
			if (orders == null || orders.isEmpty())
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "Oops! It looks like you don't have any orders this week.");
			break;
		}
		case "month": { // Find orders from first day of month to last day of month (contains today)
			LocalDate today = LocalDate.now();
			LocalDate firstDayOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
			LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
			orders = orderRepository.findOrdersPage(firstDayOfMonth, lastDayOfMonth, orderStatusIds, keyword, limit,
					offset);
			// Check empty list
			if (orders == null || orders.isEmpty())
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "Oops! It looks like you don't have any orders this month.");
			break;
		}
		case "all":
		default: // Find all orders
			orders = orderRepository.findOrdersPage(null, null, orderStatusIds, keyword, limit, offset);
			// Check empty list
			if (orders == null || orders.isEmpty())
				throw new ErrorResponse(HttpStatus.NOT_FOUND, "Oops! It looks like you don't have any orders.");
		}

		// Format time
		for (Order order : orders) {
			order.setCreatedAtStr(DateFormatter.formatDate(order.getCreatedAt()));
		}

		return orders;
	}

	/**
	 * Get count of orders
	 * 
	 * @param dateType       ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword        search by booking product name
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

	/**
	 * Update order information
	 * 
	 * @param order order request
	 * @return row effected
	 */
	@Override
	public Integer updateOrder(OrderRequestDTO order) {
		// Check if id null
		if (order.getId() == null)
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please provide order id");

		// Found order
		Order existOrder = findByOrderId(order.getId());

		// order To Update

		// Only update available attributes
		if (order.getDetailAddress() == null)
			order.setDetailAddress(existOrder.getDetailAddress());

		if (order.getMessage() == null)
			order.setMessage(existOrder.getMessage());

		if (order.getName() == null)
			order.setName(existOrder.getName());

		if (order.getPhone() == null)
			order.setPhone(existOrder.getPhone());

		if (order.getShippingFee() == null)
			order.setShippingFee(existOrder.getShippingFee());

		if (order.getTotalPrice() == null)
			order.setTotalPrice(existOrder.getTotalPrice());

		if (order.getOrderStatusId() == null && existOrder.getOrderStatus() != null) {
			order.setOrderStatusId(existOrder.getOrderStatus().getId());
		}

		if (order.getProvinceId() == null && existOrder.getProvince() != null)
			order.setProvinceId(existOrder.getProvince().getId());

		if (order.getWardId() == null && existOrder.getWard() != null)
			order.setWardId(existOrder.getWard().getId());

		if (order.getCancelledAtStatusId() == null && existOrder.getCancelledAtStatus() != null)
			order.setCancelledAtStatusId(existOrder.getCancelledAtStatus().getId());

		OrderStatus oldOrderStatus = existOrder.getOrderStatus();

		if (oldOrderStatus != null) {
			Long oldOrderStatusId = oldOrderStatus.getId();

			if (order.getOrderStatusId() != null) {
				Long newOrderStatusId = order.getOrderStatusId();

				// Order cancelled, cannot change new status
				if (oldOrderStatusId == OrderStatusEnum.CANCELLED.getId()) {
					throw new ErrorResponse(HttpStatus.BAD_REQUEST, "You cannot operate in the cancelled order");
				}

				// Order completed, cannot change new status
				if (oldOrderStatusId == OrderStatusEnum.COMPLETED.getId()) {
					throw new ErrorResponse(HttpStatus.BAD_REQUEST, "You cannot operate in the completed order");
				}

				// Cannot transfer from shipping order to new order
				if (oldOrderStatusId == OrderStatusEnum.SHIPPING.getId()
						&& newOrderStatusId == OrderStatusEnum.NEW.getId()) {
					throw new ErrorResponse(HttpStatus.BAD_REQUEST,
							"You cannot transfer from the shipping order to new order");
				}

				// Cannot Immediately transfer from new order to completed order,
				// Must be shipping
				if (oldOrderStatusId == OrderStatusEnum.NEW.getId()
						&& newOrderStatusId == OrderStatusEnum.COMPLETED.getId()) {
					throw new ErrorResponse(HttpStatus.BAD_REQUEST,
							"You cannot transfer from the new order to completed order, please transfer to shipping first");
				}

				// Know that cancelled in determined stage
				if (newOrderStatusId == OrderStatusEnum.CANCELLED.getId()) {
					order.setCancelledAtStatusId(oldOrderStatusId);
				}
			}
		}

		return orderRepository.updateOrder(order);
	}

	/**
	 * Get the revenue of last 7 days
	 * 
	 * @return List of period, revenue
	 */
	@Override
	public List<RevenueDTO> getLast7DaysRevenue() {

		LocalDate end = LocalDate.now(); // Include today
		LocalDate start = end.minusDays(6); // 7 last day

		// database result does not include revenue 0
		List<RevenueDTO> dbResult = orderRepository.getSalesGroupedBy("%Y-%m-%d", start.atStartOfDay(),
				end.atTime(LocalTime.MAX));

		List<RevenueDTO> result = new ArrayList<>();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
		// Add enough 7 last days revenue
		for (int i = 6; i >= 0; i--) {
			LocalDate date = LocalDate.now().minusDays(i);
			String key = date.toString(); // yyyy-MM-dd
			Long total = 0L;

			for (RevenueDTO r : dbResult) {
				if (r.getPeriod().equals(key)) {
					total = r.getTotal();
					break;
				}
			}

			result.add(new RevenueDTO(date.format(formatter), total));
		}
		return result;
	}

	/**
	 * Get the revenue of last 12 weeks
	 * 
	 * @return List of period, revenue
	 */
	@Override
	public List<RevenueDTO> getLast12WeeksRevenue() {
		LocalDate end = LocalDate.now();
		LocalDate start = end.minusWeeks(11).with(DayOfWeek.MONDAY);

		List<RevenueDTO> dbResult = orderRepository.getSalesGroupedBy("%x-%v", start.atStartOfDay(),
				end.atTime(LocalTime.MAX));

		List<RevenueDTO> result = new ArrayList<>();
		WeekFields wf = WeekFields.ISO;

		for (int i = 11; i >= 0; i--) {
			LocalDate weekStart = end.minusWeeks(i).with(DayOfWeek.MONDAY);
			int week = weekStart.get(wf.weekOfWeekBasedYear());
			int year = weekStart.get(wf.weekBasedYear());
			String key = String.format("%d-%02d", year, week); 
			String label = String.format("W%d",
					week
			);
			Long total = 0L;

			for (RevenueDTO r : dbResult) {
				if (r.getPeriod().equals(key)) {
					total = r.getTotal();
					break;
				}
			}

			result.add(new RevenueDTO(label, total));
		}
		return result;
	}

	/**
	 * Get the revenue of last 12 months
	 * 
	 * @return List of period, revenue
	 */
	@Override
	public List<RevenueDTO> getLast12MonthsRevenue() {
		LocalDate end = LocalDate.now();
		LocalDate start = end.minusMonths(11).withDayOfMonth(1);
		
		List<RevenueDTO> dbResult = orderRepository.getSalesGroupedBy(
				"%Y-%m", 
				start.atStartOfDay(),
				end.atTime(LocalTime.MAX)
		);
		List<RevenueDTO> result = new ArrayList<>();

		for (int i = 11; i >= 0; i--) {
			LocalDate month = end.minusMonths(i);
			String key = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));
			String label = month.format(DateTimeFormatter.ofPattern("MM/yyyy"));
			Long total = 0L;

			for (RevenueDTO r : dbResult) {
				if (r.getPeriod().equals(key)) {
					total = r.getTotal();
					break;
				}
			}

			result.add(new RevenueDTO(label, total));
		}

		return result;
	}
}
