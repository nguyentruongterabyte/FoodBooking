package com.foodbooking.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface FileStorageController {
	
	
	/**
	 * @param filepath file path from client
	 * @return resource file
	 */
	ResponseEntity<Resource> getFile(String filepath);
}
