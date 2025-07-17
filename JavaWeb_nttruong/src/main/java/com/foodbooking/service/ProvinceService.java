package com.foodbooking.service;

import java.util.List;

import com.foodbooking.entity.Province;

public interface ProvinceService {

	/**
	 * save new province
	 * 
	 * @param province province data
	 */
	public void saveProvice(Province province);

	/**
	 * get list of provinces
	 * 
	 * @return list of all provinces
	 */
	public List<Province> findAllProvinces();

	/**
	 * get count of provinces
	 * 
	 * @return count of province records
	 */
	public Integer getCount();

	/**
	 * get province by id
	 * 
	 * @param id province id
	 * @return the found province
	 */
	public Province findByProviceId(Long id);

	/**
	 * delete province
	 * 
	 * @param id province id
	 */
	public void deleteByProvinceId(Long id);
}
