package com.foodbooking.exception;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.foodbooking.dto.response.ErrorResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {
	
	// Validation exception handler
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, Object> response = new LinkedHashMap<>();
		
		List<Map<String, Object>> errors = new ArrayList<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			Map<String, Object> map = new LinkedHashMap<>();
			map.put("field", error.getField());
			map.put("rejectedValue", error.getRejectedValue());
			map.put("message", error.getDefaultMessage());
			errors.add(map);
		}
		
		response.put("timestamp", LocalDateTime.now());
		response.put("status", HttpStatus.BAD_REQUEST.value());
		response.put("message", "Validation failed!");
		response.put("errors", errors);
		
		return ResponseEntity.badRequest().body(response);
	}
	
	// The method is not supported
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	@ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
	public ResponseEntity<Object> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {
		Map<String, Object> response = new LinkedHashMap<>();
		
		response.put("timestamp", LocalDateTime.now());
		response.put("status", HttpStatus.METHOD_NOT_ALLOWED.value());
		response.put("message", "Http method '" + ex.getMethod() + "' is not allowed!");
	
		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
	}
	
	
	// Handler custom errors
	@ExceptionHandler(ErrorResponse.class)
	public ResponseEntity<Map<String, Object>> handleCustomError(ErrorResponse ex) {
		Map<String, Object> errorDetails = new LinkedHashMap<>();
		
		errorDetails.put("timestamp", LocalDateTime.now());
		errorDetails.put("status", ex.getStatus().value());
		errorDetails.put("message", ex.getMessage());
		
		return new ResponseEntity<>(errorDetails, ex.getStatus());
	}
}
