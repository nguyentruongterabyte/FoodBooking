package com.foodbooking.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.Province;
import com.foodbooking.repository.ProvinceRepository;
import com.foodbooking.service.ProvinceService;

@Service
public class ProvinceServiceImpl implements ProvinceService {

	@Autowired
	private ProvinceRepository provinceRepository;

	/**
	 * save new province
	 * 
	 * @param province province data
	 */	
	@Override
	public void saveProvice(Province province) {
		try {
			provinceRepository.saveProvice(province);
		} catch (Exception e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * get list of provinces
	 * 
	 * @return list of all provinces
	 */
	@Override
	public List<Province> findAllProvinces() {

		List<Province> provinces = provinceRepository.findAllProvinces();

		// Check null, empty
		if (provinces == null || provinces.isEmpty())
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The list of province is empty!");

		return provinces;
	}

	/**
	 * get count of provinces
	 * 
	 * @return count of province records
	 */
	@Override
	public Integer getCount() {
		return provinceRepository.getCount();
	}

	/**
	 * get province by id
	 * 
	 * @param id province id
	 * @return the found province
	 */
	@Override
	public Province findByProviceId(Long id) {

		Province foundProvince = provinceRepository.findByProviceId(id);

		// Check exist
		if (foundProvince == null)
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The province does not exist");

		return foundProvince;
	}

	/**
	 * delete province
	 * 
	 * @param id province id
	 */
	@Override
	public void deleteByProvinceId(Long id) {
		// Check exists
		if (provinceRepository.findByProviceId(id) == null)
			throw new ErrorResponse(HttpStatus.NOT_FOUND, "The province does not exist");
	
		// Delete
		provinceRepository.deleteByProvinceId(id);
	}
}
