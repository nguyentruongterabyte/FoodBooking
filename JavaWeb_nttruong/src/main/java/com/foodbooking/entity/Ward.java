package com.foodbooking.entity;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Ward {

	private Long id;

	@NotNull(message = "Please provide a name.")
	@NotBlank(message = "Please enter the name.")
	@Length(min = 1, max = 50, message = "The name length 1-50 characters")
	private String name;

	@Range(min = 0, max=1000000, message = "Shipping fee range 0 vnđ - 1,000,000 vnđ")
	@NotNull(message = "Please provide shipping fee")
	private Long shippingFee;

	@NotNull(message = "Please provide province id")
	private Long provinceId;
}
