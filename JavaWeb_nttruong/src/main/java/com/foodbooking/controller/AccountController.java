package com.foodbooking.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;

import com.foodbooking.dto.AccountDTO;

public interface AccountController {

	/**
	 * API change password
	 * 
	 * @param password    password from client
	 * @param newPassword new password from client
	 * @return message
	 */
	public ResponseEntity<?> changePassword(AccountDTO account, Principal principal);
}
