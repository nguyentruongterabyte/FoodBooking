package com.foodbooking.controller;

import org.springframework.http.ResponseEntity;

import com.foodbooking.entity.Province;

public interface ProvinceController {

	/**
	 * Save province
	 * 
	 * @param province province from request
	 * @return API new province
	 */
	public ResponseEntity<?> saveProvice(Province province);

	/**
	 * Get list of province
	 * 
	 * @return API with data list of province
	 */
	public ResponseEntity<?> findAllProvinces();

	/**
	 * Delete province
	 * 
	 * @param id id from request
	 * @return API response
	 */
	public ResponseEntity<?> deleteByProvinceId(Long id);
}
