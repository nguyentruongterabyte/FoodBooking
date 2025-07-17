package com.foodbooking.controller;

import org.springframework.http.ResponseEntity;

import com.foodbooking.dto.request.BookingProductRequestDTO;

public interface BookingProductController {
	/**
	 * @param form form data from client (include image file)
	 * @return API new booking product
	 */
	public ResponseEntity<?> saveBookingProduct(BookingProductRequestDTO form);

	/**
	 * Get total of items of booking products
	 * @param keyword search by name
	 * @param type food/drink
	 * @param isDeleted null: get by admin, false: get by customer
	 * @return total of items
	 */
	public ResponseEntity<?> getCountItems(String keyword, Boolean isDeleted, String type);

	/**
	 * @param keyword      keyword searching
	 * @param isDeleted    null: get by admin, false: get by customer
	 * @param includeTotal total page
	 * @param priceDESC    sort by price
	 * @param page         start at 1
	 * @param size         items per page
	 * @return API pagination items
	 */
	public ResponseEntity<?> getBookingProductsPage(
			String keyword, 
			Boolean isDeleted,
			String type,
			Boolean priceDESC,
			Boolean includeTotal,
			Integer page,
			Integer size);

	/**
	 * API update booking product
	 * 
	 * @param id   of product
	 * @param form form data from client (include image file)
	 * @return API updated booking product
	 */
	public ResponseEntity<?> updateBookingProduct(Long id, BookingProductRequestDTO form);

	
	/**
	 * API delete booking product (update isDeleted = true)
	 * 
	 * @param id id from request
	 * @return message
	 */
	public ResponseEntity<?> deleteBookingProduct(Long id);
}
