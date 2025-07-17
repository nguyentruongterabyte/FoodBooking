package com.foodbooking.controller;

import org.springframework.http.ResponseEntity;

import com.foodbooking.entity.Ward;

public interface WardController {
	/**
	 * Save ward
	 * 
	 * @param ward ward from request
	 * @return API new ward
	 */
	public ResponseEntity<?> saveProvice(Ward ward);

	/**
	 * Get list of ward by province id
	 * 
	 * @return API with data list of ward
	 */
	public ResponseEntity<?> findWardsByProvinceId(Long provinceId);

	/**
	 * Delete ward
	 * 
	 * @param id id from request
	 * @return API response
	 */
	public ResponseEntity<?> deleteByWardId(Long id);
}
