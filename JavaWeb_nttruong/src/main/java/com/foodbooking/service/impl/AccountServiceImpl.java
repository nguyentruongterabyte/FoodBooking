package com.foodbooking.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.foodbooking.entity.Account;
import com.foodbooking.repository.AccountRepository;
import com.foodbooking.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder; // MD5 encoder in 
	/**
	 * Change password
	 * 
	 * @param username    username
	 * @param newPassword new password
	 */
	@Override
	public void changePassword(String username, String newPassword) {
		String encodedPassword = passwordEncoder.encode(newPassword);
		accountRepository.updatePassword(username, encodedPassword);
	}

	/**
	 * check matches password
	 * 
	 * @param username
	 * @param rawPassword provided password
	 * @return matches or not
	 */
	@Override
	public Boolean checkCurrentPassword(String username, String rawPassword) {
		// Check account exists
		Account account = accountRepository.findByUsername(username);
		if (account == null) 
			return false;
		
		return passwordEncoder.matches(rawPassword, account.getPassword());
	}

}
