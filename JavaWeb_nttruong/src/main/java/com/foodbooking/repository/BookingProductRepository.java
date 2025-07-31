package com.foodbooking.repository;

import java.util.List;

import com.foodbooking.entity.BookingProduct;

public interface BookingProductRepository {
	public List<BookingProduct> findBookingProductsPage(
			String keyword,
			Boolean isDeleted,
			String type, 
			Boolean priceDESC,
			Integer offset, 
			Integer limit
			);
	public Boolean existsByNameInType(String name, String type);
	public Boolean existsByBookingProductId(Long id);
	public void saveBookingProduct(BookingProduct bookingProduct);
	public Integer getCount(String keyword, Boolean isDeleted, String type);
	public Integer updateBookingProduct(BookingProduct bookingProduct);
	public BookingProduct findByBookingProductId(Long id);
	public List<BookingProduct> findAllBookingProducts();
}
