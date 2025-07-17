package com.foodbooking.entity;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Province {
	
	private Long id;
	
	@NotNull(message = "Please provide a name.")
	@NotBlank(message = "Please enter the name.")
	@Length(min = 1, max = 30, message = "The name length 1-30 characters")
	private String name;
}
