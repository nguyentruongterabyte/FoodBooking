package com.foodbooking.controller.impl;

import java.security.Principal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.AccountController;
import com.foodbooking.dto.AccountDTO;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.service.AccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/accounts")
public class AccountControllerImpl implements AccountController{

	@Autowired
	private AccountService accountService;

	/**
	 * API change password
	 * 
	 * @param password    password from client
	 * @param newPassword new password from client
	 * @return message
	 */
	@Override
	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(
			@Valid @RequestBody AccountDTO account, 
			Principal principal
			) {
		if (principal == null) 
			throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized!");
		
		String username = principal.getName(); // Get username from session
		
		if (!accountService.checkCurrentPassword(username, account.getPassword()))
				throw new ErrorResponse(HttpStatus.BAD_REQUEST, "The password is incorrect");
		
		// Update password
		accountService.changePassword(username, account.getNewPassword());
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Update password successfully!")
						.build()
				);
	}

}
