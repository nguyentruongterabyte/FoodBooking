package com.foodbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodbooking.entity.Ward;
import com.foodbooking.mapper.WardMapper;
import com.foodbooking.repository.WardRepository;

@Repository
public class WardRepositoryImpl implements WardRepository {

	@Autowired
	private WardMapper wardMapper;

	@Override
	public void saveWard(Ward ward) {
		wardMapper.saveWard(ward);
	}

	@Override
	public List<Ward> findWardsByProvinceId(Long provinceId) {
		return wardMapper.findWardsByProvinceId(provinceId);
	}

	@Override
	public Integer getCount() {
		return wardMapper.getCount();
	}

	@Override
	public Ward findByWardId(Long id) {
		return wardMapper.findByWardId(id);
	}

	@Override
	public void deleteByWardId(Long id) {
		wardMapper.findByWardId(id);
	}

}
