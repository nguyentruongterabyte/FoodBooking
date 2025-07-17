package com.foodbooking.repository;

import java.util.List;

import com.foodbooking.entity.Province;

public interface ProvinceRepository {

	public void saveProvice(Province province);

	public List<Province> findAllProvinces();

	public Integer getCount();

	public Province findByProviceId(Long id);

	public void deleteByProvinceId(Long id);
}
