package com.foodbooking.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import com.foodbooking.entity.OrderDetail;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderRequestDTO {
	private Long id;
	
	@NotNull(message = "Please provide your name.")
	@NotBlank(message = "Please enter your name.")
	private String name;
	
	@NotNull(message = "Please provide detail address.")
	@NotBlank(message = "Please enter your detail address.")
	@Length(min = 30, max = 95, message = "The length of the detail address between 30 to 95 characters.")
	private String detailAddress;
	
	private String message;
	
	@NotNull(message = "Please provide your phone number.")
	@NotBlank(message = "Please enter your phone number.")
	@Pattern(regexp = "^(\\d{3}[- .]?){2}\\d{4}$", message = "The phone number is invalid")
	private String phone;
	
	private Long shippingFee;
	private Long totalPrice;
	
	@NotNull(message = "Please select a city.")
	private Long provinceId;
	
	@NotNull(message = "Please select a ward.")
	private Long wardId;
	
	private Integer orderStatusId;
	
	private LocalDateTime createdAt;
	
	private List<OrderDetail> bookingProducts;
}
