package com.foodbooking.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.foodbooking.entity.Account;

@Mapper
public interface AccountMapper {
	public Account findByUsername(String username);
	public Integer updatePassword(@Param("username") String username, @Param("password") String password);
}
