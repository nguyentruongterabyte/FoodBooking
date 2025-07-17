package com.foodbooking.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodbooking.entity.Province;
import com.foodbooking.mapper.ProvinceMapper;
import com.foodbooking.repository.ProvinceRepository;

@Repository
public class ProvinceRepositoryImpl implements ProvinceRepository {

	@Autowired
	private ProvinceMapper provinceMapper;
	
	@Override
	public void saveProvice(Province province) {
		provinceMapper.saveProvince(province);
	}

	@Override
	public List<Province> findAllProvinces() {
		return provinceMapper.findAllProvinces();
	}

	@Override
	public Integer getCount() {
		return provinceMapper.getCount();
	}

	@Override
	public Province findByProviceId(Long id) {
		return provinceMapper.findByProviceId(id);
	}

	@Override
	public void deleteByProvinceId(Long id) {
		provinceMapper.deleteByProvinceId(id);
	}
	
}
