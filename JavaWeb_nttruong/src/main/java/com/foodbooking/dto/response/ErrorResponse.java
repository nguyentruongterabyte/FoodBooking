package com.foodbooking.dto.response;

import org.springframework.http.HttpStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ErrorResponse extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	private HttpStatus status;

	public ErrorResponse(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}
}
