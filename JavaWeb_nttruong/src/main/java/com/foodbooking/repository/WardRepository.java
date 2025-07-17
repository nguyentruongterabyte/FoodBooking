package com.foodbooking.repository;

import java.util.List;

import com.foodbooking.entity.Ward;

public interface WardRepository {
	public void saveWard(Ward ward);

	public List<Ward> findWardsByProvinceId(Long provinceId);

	public Integer getCount();

	public Ward findByWardId(Long id);

	public void deleteByWardId(Long id);
}
