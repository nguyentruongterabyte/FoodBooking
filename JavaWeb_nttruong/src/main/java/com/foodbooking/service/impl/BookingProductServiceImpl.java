package com.foodbooking.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.repository.BookingProductRepository;
import com.foodbooking.service.BookingProductService;
import com.foodbooking.service.FileStorageService;

@Service
public class BookingProductServiceImpl implements BookingProductService {

	@Autowired
	private BookingProductRepository bookingProductRepository;
	
	@Autowired
	private FileStorageService fileStorageService;

	/**
	 * save new booking product
	 * 
	 * @param bookingProduct booking product data
	 */
	@Override
	public void saveBookingProduct(BookingProduct bookingProduct) {

		// Check if name duplicate
		boolean isExistsByNameInType = bookingProductRepository.existsByNameInType(bookingProduct.getName(),
				bookingProduct.getType());

		if (isExistsByNameInType)
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate name '" + bookingProduct.getName() + "'");
		try {
			bookingProductRepository.saveBookingProduct(bookingProduct);
		} catch (Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * @param isDeleted null: get by admin, false: get by customer
	 * @param offset    offset = page * limit
	 * @param limit     the size of item per page
	 * @return list of booking products (pagination)
	 */
	@Override
	public List<BookingProduct> findBookingProductsPage(
			String keyword,
			Boolean isDeleted,
			String type,
			Boolean priceDESC,
			Integer offset,
			Integer limit) {
		List<BookingProduct> bookingProducts = bookingProductRepository
				.findBookingProductsPage(keyword, isDeleted, type, priceDESC, offset, limit);

		if (bookingProducts == null || bookingProducts.isEmpty()) {
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The list of product booking is empty.");
		}
		return bookingProducts;
	}

	/**
	 * 
	 * Get total of items of booking products
	 * 
	 * @param keyword search by name
	 * @param isDeleted null admin, false customer
	 * @param type food/drink
	 * @return total of items
	 */
	@Override
	public Integer getCount(String keyword, Boolean isDeleted, String type) {
		return bookingProductRepository.getCount(keyword, isDeleted, type);
	}

	/**
	 * Update booking product
	 * 
	 * @param bookingProduct booking product from request
	 * @return row effected
	 */
	@Override
	public Integer updateBookingProduct(BookingProduct bookingProduct) {
		
		// Check if id null
		if (bookingProduct.getId() == null) 
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please provide booking product id");
		
		// Check if booking product not found
		BookingProduct existProduct = findByBookingProductId(bookingProduct.getId());
		
		// Only update available attributes 
		if (bookingProduct.getType() != null) {
			existProduct.setType(bookingProduct.getType());
		}
		
		if (bookingProduct.getName() != null) {
			existProduct.setName(bookingProduct.getName());
		}
		
		if (bookingProduct.getDescription() != null) {
			existProduct.setDescription(bookingProduct.getDescription());;
		}
		
		if (bookingProduct.getImageUrl() != null) {
			// Delete old file from uploads folder
			String oldImageUrl = existProduct.getImageUrl();
			fileStorageService.deleteFile(oldImageUrl);
			existProduct.setImageUrl(bookingProduct.getImageUrl());
		}
		
		if (bookingProduct.getPrice() != null) {
			existProduct.setPrice(bookingProduct.getPrice());
		}
		
		if (bookingProduct.getIsDeleted() != null) {
			existProduct.setIsDeleted(bookingProduct.getIsDeleted());
		}
		
		int rowEffected = bookingProductRepository.updateBookingProduct(existProduct);
		return rowEffected;
	}

	/**
	 * Find booking product by id
	 * 
	 * @param id id of booking product want to find
	 * @return found booking product
	 */
	@Override
	public BookingProduct findByBookingProductId(Long id) {
		// Check if booking product not found
		BookingProduct existProduct = bookingProductRepository.findByBookingProductId(id);
		if (existProduct == null) 
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The booking product not found");
		
		return existProduct;
	}

}
