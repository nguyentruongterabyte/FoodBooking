package com.foodbooking.controller.impl;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.AccountController;
import com.foodbooking.dto.AccountDTO;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.Account;
import com.foodbooking.entity.CustomUserDetails;
import com.foodbooking.service.AccountService;
import com.foodbooking.service.CustomUserDetailService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/accounts")
public class AccountControllerImpl implements AccountController{

	@Autowired
	private AccountService accountService;
	
	@Autowired
	private CustomUserDetailService customUserDetailService;
	
	@Autowired
	private FirebaseAuth firebaseAuth;

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

	
	@Override
	@PostMapping("/firebase-auth")
	public ResponseEntity<?> authenticateWithFirebase(@RequestBody Map<String, String> request,
			HttpServletRequest httpServletRequest) {
		
		String idToken = request.get("idToken");
		System.out.println("idToken: " + idToken);
		try {
			FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
			
			String email = decodedToken.getEmail(); 
			UserDetails userDetails;
			try {
				userDetails = customUserDetailService.loadUserByUsername(email);				
			} catch (UsernameNotFoundException e) {
				Account newAccount = new Account();
				newAccount.setRole("ROLE_USER");
				newAccount.setUsername(email);
				newAccount.setPassword("");
				accountService.saveAccount(newAccount);
				
				userDetails = new CustomUserDetails(newAccount);
			}
			
			UsernamePasswordAuthenticationToken authToken = 
					new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
			
			SecurityContextHolder.getContext().setAuthentication(authToken);
			
			HttpSession session = httpServletRequest.getSession(true);
			
			session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, 
					SecurityContextHolder.getContext());
			
			// Return response
			return ResponseEntity
					.status(HttpStatus.OK)
					.body(ApiResponse.builder()
							.status(HttpStatus.OK.value())
							.timestamp(LocalDateTime.now())
							.message("Login success!")
							.build()
					);
		} catch (FirebaseAuthException e) {
			throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid firebase token");
		}
	}

}
