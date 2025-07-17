package com.foodbooking.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.foodbooking.entity.Ward;

@Mapper
public interface WardMapper {
	public void saveWard(Ward ward);
	
	public List<Ward> findWardsByProvinceId(Long provinceId);

	public Integer getCount();

	public Ward findByWardId(Long id);

	public void deleteByWardId(Long id);

}
