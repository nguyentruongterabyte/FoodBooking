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

import com.foodbooking.controller.WardController;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.entity.Ward;
import com.foodbooking.service.WardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/wards")
public class WardControllerImpl implements WardController {
	private final WardService wardService;

	public WardControllerImpl(WardService wardService) {
		this.wardService = wardService;
	}

	/**
	 * Save ward
	 * 
	 * @param ward ward from request
	 * @return API new ward
	 */
	@Override
	@PostMapping("")
	public ResponseEntity<?> saveProvice(@Valid @RequestBody Ward ward) {

		// Save ward
		wardService.saveWard(ward);

		// Return response
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder().status(HttpStatus.CREATED.value())
				.timestamp(LocalDateTime.now()).message("Created successfully!").data(ward).build());
	}

	/**
	 * Get list of ward by province id
	 * 
	 * @return API with data list of ward
	 */
	@Override
	@GetMapping("/by-province-id/{provinceId}")
	public ResponseEntity<?> findWardsByProvinceId(@PathVariable Long provinceId) {

		// Retrieve list of ward
		List<Ward> wards = wardService.findWardsByProvinceId(provinceId);

		// Return response
		return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder().status(HttpStatus.OK.value())
				.timestamp(LocalDateTime.now()).message("Retrieve successfully!").data(wards).build());
	}

	/**
	 * Delete ward
	 * 
	 * @param id id from request
	 * @return API response
	 */
	@Override
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteByWardId(Long id) {
		// Check path variable null
		if (id == null)
			throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please provide the id");
		
		// Delete
		wardService.deleteByWardId(id);
		
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
