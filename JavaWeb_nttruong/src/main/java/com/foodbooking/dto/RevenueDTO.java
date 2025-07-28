package com.foodbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDTO {
	private String period;
	private Long total;
}
