package com.foodbooking.controller.impl;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbooking.controller.FileStorageController;
import com.foodbooking.service.FileStorageService;

@RestController
@RequestMapping("api/files")
public class FileStoreageControllerImpl implements FileStorageController {

	private final FileStorageService fileStorageService;

	private FileStoreageControllerImpl(FileStorageService fileStorageService) {
		super();
		this.fileStorageService = fileStorageService;
	}

	/**
	 * @param filepath file path from client
	 * @return resource file
	 */
	@Override
	@GetMapping("/{filepath:.+}")
	public ResponseEntity<Resource> getFile(@PathVariable String filepath) {
		Resource file = fileStorageService.loadFile(filepath);

		// File does not exist, return 404 not found
		if (file == null)
			return ResponseEntity.notFound().build();

		return ResponseEntity.ok().contentType(MediaTypeFactory.getMediaType(file).orElse(null))
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"").body(file);
	}

}
