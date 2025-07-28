package com.foodbooking.controller.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.OrderController;
import com.foodbooking.dto.RevenueDTO;
import com.foodbooking.dto.request.OrderRequestDTO;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.dto.response.PagedResponse;
import com.foodbooking.entity.Order;
import com.foodbooking.entity.OrderStatusEnum;
import com.foodbooking.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/orders")
public class OrderControllerImpl implements OrderController {
	private final OrderService orderService;

	public OrderControllerImpl(OrderService orderService) {
		this.orderService = orderService;
	}

	/**
	 * API get order by id
	 * 
	 * @param id from request
	 * @return order information
	 */
	@Override
	@GetMapping("/{id}")
	public ResponseEntity<?> getByOrderId(@PathVariable Long id) {
		Order foundOrder = orderService.findByOrderId(id);
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(foundOrder)
						.build()
				);
	}

	/**
	 * API create order
	 * 
	 * @param order from request
	 * @return new order information
	 */
	@Override
	@PostMapping("")
	public ResponseEntity<?> saveOrder(@Valid @RequestBody OrderRequestDTO order) {
		
		// save order
		orderService.saveOrder(order);
		
		// Get new order information
		Order newOrder = orderService.findByOrderId(order.getId());
		// Return response
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(ApiResponse.builder()
						.status(HttpStatus.CREATED.value())
						.timestamp(LocalDateTime.now())
						.message("Created successfully!")
						.data(newOrder)
						.build()
				);
	}

	
	/**
	 * API Get today's sale
	 * 
	 * @return (totalPrice + shipping fee)
	 */
	@Override
	@GetMapping("/today-sales")
	public ResponseEntity<?> getTodaySales() {
		Long todaySales = orderService.getTodaySales();
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(todaySales)
						.build()
				);
	}

	/**
	 * API Get quantity of order today
	 * 
	 * @param orderStatusId NEW 1, SHIPPING 2, COMPLETED 4, CANCELLED 3
	 * @return
	 */
	@Override
	@GetMapping("/count-today")
	public ResponseEntity<?> getCountToday(@RequestParam(required = false) Long orderStatusId) {
		
		Integer countToday = 0;
		
		if (orderStatusId != null) {
			// Count single order status
			countToday = orderService.getCountToday(orderStatusId);			
		} else {
			// Count all order status
			List<Long> allOrderStatusIds = new ArrayList<>();
			allOrderStatusIds.add(OrderStatusEnum.NEW.getId());
			allOrderStatusIds.add(OrderStatusEnum.SHIPPING.getId());
			allOrderStatusIds.add(OrderStatusEnum.CANCELLED.getId());
			allOrderStatusIds.add(OrderStatusEnum.COMPLETED.getId());
			countToday = orderService.getCount("today", null, null);
		}
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(countToday)
						.build()
				);
	}

	/**
	 * API Get list of orders pagination
	 * 
	 * @param dateType ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword search by booking product name
	 * @param limit item per page
	 * @param offset offset
	 * @return list of orders
	 */
	@Override
	@GetMapping("/{page}/{size}")
	public ResponseEntity<?> getOrdersPage(
			@RequestParam(defaultValue = "today", required = false) String dateType, 
			@RequestParam(required = false) List<Long> orderStatusIds,
			@RequestParam(required = false) String keyword, 
			@RequestParam(required = false) Boolean includeTotal,
			@PathVariable Integer size,
			@PathVariable Integer page
	) {
		
		List<Order> orders = orderService.findOrdersPage(dateType, orderStatusIds, keyword, size, (page - 1) * size);
		
		PagedResponse<Order> pagedResponse = new PagedResponse<>();
		
		// Set current page
		pagedResponse.setPage(page);
		
		// Set items
		pagedResponse.setItems(orders);
		
		// Include total pages
		if (includeTotal != null && includeTotal) {
			int totalItems = orderService.getCount(dateType, orderStatusIds, keyword);
			int totalPages = (int) Math.ceil((double) totalItems / (double) size);
			pagedResponse.setTotalPages(totalPages);
		}
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(pagedResponse)
						.build()
				);
	}

	/**
	 * API Get count of orders
	 * 
	 * @param dateType ALL, TODAY, WEEK, MONTH
	 * @param orderStatusIds order statuses [1, 2]
	 * @param keyword search by booking product name
	 * @return count of order
	 */
	@Override
	@GetMapping("/count")
	public ResponseEntity<?> getCount(
			@RequestParam(defaultValue = "today", required = false) String dateType, 
			@RequestParam(required = false) List<Long> orderStatusIds,
			@RequestParam(required = false) String keyword
	) {
		int count = orderService.getCount(dateType, orderStatusIds, keyword);
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(count)
						.build()
				);
	}

	/**
	 * API Update order status
	 * 
	 * @param orderId  order id
	 * @param statusId new status
	 * @return
	 */
	@Override
	@PatchMapping("/{orderId}/{orderStatusId}")
	public ResponseEntity<?> updateOrderStatus(
			@PathVariable Long orderId, 
			@PathVariable Long orderStatusId) {
		
		OrderRequestDTO orderToUpdate = new OrderRequestDTO();
		orderToUpdate.setId(orderId);
		orderToUpdate.setOrderStatusId(orderStatusId);
	
		int rowEffected = orderService.updateOrder(orderToUpdate);
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Update successfully!")
						.data(rowEffected)
						.build()
				);
	}

	/**
	 * API Get revenue day|week|month
	 * 
	 * @param type day|week|month
	 * @return API list of revenue
	 */
	@Override
	@GetMapping("/revenue")
	public ResponseEntity<?> getRevenue(@RequestParam(defaultValue = "day") String type) {
		
		List<RevenueDTO> revenue = new ArrayList<>();
		
		switch (type) {
		case "day":
			revenue = orderService.getLast7DaysRevenue();
			break;
		case "week":
			revenue = orderService.getLast12WeeksRevenue();
			break;
		case "month":
			revenue = orderService.getLast12MonthsRevenue();
			break;
		default:
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid type of revenue");
		}
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(revenue)
						.build()
				);
	}

}
