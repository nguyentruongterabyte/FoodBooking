package com.foodbooking.dto.request;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BookingProductRequestDTO {
	
	@NotNull(message = "Please provide type.")
	@NotBlank(message = "Please choose type.")
	@Pattern(regexp = "food|drink", message = "Type must be 'food' or 'drink'.")
	String type;
	
	@NotBlank(message = "Please enter a name.")
	@NotNull(message = "Please provide a name.")
	@Length(max = 100, message = "The max length is 100 characters.")
	String name; 
	

	@Length(max = 500, message = "The max length is 500 characters")
	String description;

	@NotNull(message = "Please provide price.")
	@Range(max = 9999999999L, message = "The price's max length is 10 number.")
	Long price;
	
	String imageUrl;
	Boolean isDeleted;
	MultipartFile imageFile;
}
