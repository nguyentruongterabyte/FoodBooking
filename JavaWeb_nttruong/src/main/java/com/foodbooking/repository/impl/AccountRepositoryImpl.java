package com.foodbooking.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodbooking.entity.Account;
import com.foodbooking.mapper.AccountMapper;
import com.foodbooking.repository.AccountRepository;

@Repository
public class AccountRepositoryImpl implements AccountRepository {

	@Autowired
	private AccountMapper accountMapper;

	@Override
	public Account findByUsername(String username) {
		return accountMapper.findByUsername(username);
	}

	@Override
	public Integer updatePassword(String username, String password) {
		return accountMapper.updatePassword(username, password);
	}

	@Override
	public void saveAccount(Account account) {
		accountMapper.saveAccount(account);
	}

}
