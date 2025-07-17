package com.foodbooking.service;

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
}
