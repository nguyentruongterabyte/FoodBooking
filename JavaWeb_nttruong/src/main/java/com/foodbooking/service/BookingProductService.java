package com.foodbooking.service;

import java.util.List;

import com.foodbooking.entity.BookingProduct;

public interface BookingProductService {
	/**
	 * save new booking product
	 * 
	 * @param bookingProduct booking product data
	 */
	public void saveBookingProduct(BookingProduct bookingProduct);

	/**
	 * @param isDeleted null: get by admin, false: get by customer
	 * @param type      food/drink
	 * @param offset    offset = page * limit
	 * @param limit     the size of item per page
	 * @return list of booking products (pagination)
	 */
	public List<BookingProduct> findBookingProductsPage(
			String keyword,
			Boolean isDeleted,
			String type,
			Boolean priceDESC,
			Integer offset,
			Integer limit);


	/**
	 * 
	 * Get total of items of booking products
	 * 
	 * @param keyword search by name
	 * @param isDeleted null admin, false customer
	 * @param type food/drink
	 * @return total of items
	 */
	public Integer getCount(String keyword, Boolean isDeleted, String type);

	/**
	 * Update booking product
	 * 
	 * @param bookingProduct booking product from request
	 * @return row effected
	 */
	public Integer updateBookingProduct(BookingProduct bookingProduct);

	/**
	 * Find booking product by id
	 * 
	 * @param id id of booking product want to find
	 * @return found booking product
	 */
	public BookingProduct findByBookingProductId(Long id);
}
