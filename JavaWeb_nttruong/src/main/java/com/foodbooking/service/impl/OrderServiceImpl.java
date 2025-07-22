package com.foodbooking.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
		foundOrder.setCreatedAtStr(formatDate(foundOrder.getCreatedAt()));

		return foundOrder;
	}

	
	/**
	 * Format local date time to string
	 * 
	 * @param dateTime 
	 * @return String pattern
	 */
	private String formatDate(LocalDateTime dateTime) {
		String pattern = "dd MMM yyyy";

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		return dateTime.format(formatter);
	}
}
