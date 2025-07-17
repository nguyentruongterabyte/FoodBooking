package com.foodbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.foodbooking.entity.Account;
import com.foodbooking.repository.AccountRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {
	@Autowired
	private AccountRepository accountRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Account account = accountRepository.findByUsername(username);

		if (account == null) {
			throw new UsernameNotFoundException("User not found");
		}
		return User.builder()
				.username(account.getUsername())
				.password(account.getPassword()) // password type MD5
				.roles(account.getRole().replace("ROLE_", ""))
				.build();
	}
}
