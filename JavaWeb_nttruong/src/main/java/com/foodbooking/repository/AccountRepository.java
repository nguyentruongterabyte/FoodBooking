package com.foodbooking.repository;

import com.foodbooking.entity.Account;

public interface AccountRepository {
	public Account findByUsername(String username);
	public Integer updatePassword(String username, String password);

}
