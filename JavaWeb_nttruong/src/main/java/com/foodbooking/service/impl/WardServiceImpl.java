package com.foodbooking.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.Ward;
import com.foodbooking.repository.WardRepository;
import com.foodbooking.service.ProvinceService;
import com.foodbooking.service.WardService;

@Service
public class WardServiceImpl implements WardService {

	@Autowired
	private WardRepository wardRepository;

	@Autowired
	private ProvinceService provinceService;

	/**
	 * save new ward
	 * 
	 * @param ward ward data
	 */
	@Override
	public void saveWard(Ward ward) {
		try {

			// Check exist province
			provinceService.findByProviceId(ward.getProvinceId());

			wardRepository.saveWard(ward);
		} catch (Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * get list of wards by province id
	 * 
	 * @return list of wards
	 */
	@Override
	public List<Ward> findWardsByProvinceId(Long provinceId) {
		List<Ward> wards = wardRepository.findWardsByProvinceId(provinceId);

		// Check exist province
		provinceService.findByProviceId(provinceId);

		// Check null, empty
		if (wards == null || wards.isEmpty())
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The list of ward is empty!");

		return wards;
	}

	/**
	 * get count of wards
	 * 
	 * @return count of wards records
	 */
	@Override
	public Integer getCount() {
		return wardRepository.getCount();
	}

	/**
	 * get ward by id
	 * 
	 * @param id ward id
	 * @return the found ward
	 */
	@Override
	public Ward findByWardId(Long id) {
		Ward foundWard = wardRepository.findByWardId(id);

		// Check exist
		if (foundWard == null)
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The ward does not exist");

		return foundWard;
	}

	/**
	 * delete ward
	 * 
	 * @param id ward id
	 */
	@Override
	public void deleteByWardId(Long id) {
		// Check exists
		if (wardRepository.findByWardId(id) == null)
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The ward does not exist");

		// Delete
		wardRepository.deleteByWardId(id);

	}
}
