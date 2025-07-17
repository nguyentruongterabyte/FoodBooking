package com.foodbooking.service;

import java.util.List;

import com.foodbooking.entity.Ward;

public interface WardService {

	/**
	 * save new ward
	 * 
	 * @param ward ward data
	 */
	public void saveWard(Ward ward);

	/**
	 * get list of wards by province id
	 * 
	 * @return list of wards
	 */
	public List<Ward> findWardsByProvinceId(Long provinceId);

	/**
	 * get count of wards
	 * 
	 * @return count of wards records
	 */
	public Integer getCount();

	/**
	 * get ward by id
	 * 
	 * @param id ward id
	 * @return the found ward
	 */
	public Ward findByWardId(Long id);

	/**
	 * delete ward
	 * 
	 * @param id ward id
	 */
	public void deleteByWardId(Long id);
}
