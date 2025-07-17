package com.foodbooking.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse {
	private int status;
	private LocalDateTime timestamp;
	private String message;
	private Object data;
}
