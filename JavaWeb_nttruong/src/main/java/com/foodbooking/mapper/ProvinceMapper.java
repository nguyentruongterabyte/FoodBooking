package com.foodbooking.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.foodbooking.entity.Province;

@Mapper
public interface ProvinceMapper {
	public void saveProvince(Province province);

	public List<Province> findAllProvinces();

	public Integer getCount();

	public Province findByProviceId(Long id);

	public void deleteByProvinceId(Long id);
}
