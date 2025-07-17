package com.foodbooking.controller.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.ProvinceController;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.Province;
import com.foodbooking.service.ProvinceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/provinces")
public class ProvinceControllerImpl implements ProvinceController {
	
	private final ProvinceService provinceService;

	public ProvinceControllerImpl(ProvinceService provinceService) {
		this.provinceService = provinceService;
	}

	/**
	 * Save province
	 * 
	 * @param province province from request
	 * @return API new province
	 */
	@Override
	@PostMapping("")
	public ResponseEntity<?> saveProvice(@Valid @RequestBody Province province) {
		
		// Save province
		provinceService.saveProvice(province);
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(ApiResponse.builder()
						.status(HttpStatus.CREATED.value())
						.timestamp(LocalDateTime.now())
						.message("Created successfully!")
						.data(province)
						.build()
				);
	}

	/**
	 * Get list of province
	 * 
	 * @return API with data list of province
	 */
	@Override
	@GetMapping("")
	public ResponseEntity<?> findAllProvinces() {
		// Retrieve list of province
		List<Province> provinces = provinceService.findAllProvinces();
		
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(provinces)
						.build()
				);
	}

	/**
	 * Delete province
	 * 
	 * @param id id from request
	 * @return API response
	 */
	@Override
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteByProvinceId(@PathVariable Long id) {
		
		// Check path variable null
		if (id == null)
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please provide the id");
		
		// Delete
		provinceService.deleteByProvinceId(id);

		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Delete successfully!")
						.build()
				);
	}
		
}
