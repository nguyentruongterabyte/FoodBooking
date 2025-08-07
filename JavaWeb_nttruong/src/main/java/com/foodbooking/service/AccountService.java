package com.foodbooking.service;

import com.foodbooking.entity.Account;

public interface AccountService {
	/**
	 * Change password
	 * @param username username
	 * @param newPassword new password
	 */
	public void changePassword(String username, String newPassword);
	/**
	 * check matches password
	 * @param username
	 * @param rawPassword provided password
	 * @return matches or not
	 */
	public Boolean checkCurrentPassword(String username, String rawPassword);
	
	/**
	 * Find account by username
	 * 
	 * @param username email or username
	 * @return account
	 */
	public Account findByUsername(String username);
	
	
	/**
	 * Save account
	 * @param account
	 */
	public void saveAccount(Account account);
}
