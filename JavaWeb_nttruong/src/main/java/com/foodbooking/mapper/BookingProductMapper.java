package com.foodbooking.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.foodbooking.entity.BookingProduct;

@Mapper
public interface BookingProductMapper {
	public List<BookingProduct> findBookingProductsPage(
			@Param("keyword") String keyword,
			@Param("isDeleted") Boolean isDeleted,
			@Param("type") String type, 
			@Param("priceDESC") Boolean priceDESC,
			@Param("offset") Integer offset, 
			@Param("limit") Integer limit
			);
	
	public Boolean existsByNameInType(
			@Param("name") String name, 
			@Param("type") String type);
	public Boolean existsById(Long id);
	public void saveBookingProduct(BookingProduct bookingProduct);
	public Integer getCount(
			@Param("keyword") String keyword,
			@Param("isDeleted") Boolean isDeleted, 
			@Param("type") String type);
	public Integer updateBookingProduct(BookingProduct bookingProduct);
	public BookingProduct findByBookingProductId(Long id);
}
