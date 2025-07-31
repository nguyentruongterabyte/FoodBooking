package com.foodbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodbooking.entity.BookingProduct;
import com.foodbooking.mapper.BookingProductMapper;
import com.foodbooking.repository.BookingProductRepository;

@Repository
public class BookingProductRepositoryImpl implements BookingProductRepository {
	@Autowired
	private BookingProductMapper bookingProductMapper;
	
	@Override
	public void saveBookingProduct(BookingProduct bookingProduct) {
		bookingProductMapper.saveBookingProduct(bookingProduct);
	}

	@Override
	public Boolean existsByNameInType(String name, String type) {
		return bookingProductMapper.existsByNameInType(name, type);
	}

	@Override
	public List<BookingProduct> findBookingProductsPage(
			String keyword, 
			Boolean isDeleted, 
			String type, 
			Boolean priceDESC,
			Integer offset,
			Integer limit) {
		return bookingProductMapper.findBookingProductsPage(
				keyword, isDeleted, type, priceDESC, offset, limit
				);
	}

	@Override
	public Integer getCount(String keyword, Boolean isDeleted, String type) {
		return bookingProductMapper.getCount(keyword, isDeleted, type);
	}

	@Override
	public Integer updateBookingProduct(BookingProduct bookingProduct) {
		return bookingProductMapper.updateBookingProduct(bookingProduct);
	}

	@Override
	public BookingProduct findByBookingProductId(Long id) {
		return bookingProductMapper.findByBookingProductId(id);
	}

	@Override
	public Boolean existsByBookingProductId(Long id) {
		return bookingProductMapper.existsById(id);
	}

	@Override
	public List<BookingProduct> findAllBookingProducts() {
		return bookingProductMapper.findAllBookingProducts();
	}

}
