package com.foodbooking.service;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

	/**
	 * @param imageFile image file upload from client
	 * @return string of image path
	 */
	public String saveImage(MultipartFile imageFile);

	/**
	 * @param file file upload from client
	 * @return string of path file
	 */
	public String saveFile(MultipartFile file) throws IOException;

	/**
	 * @param filename filename from client
	 * @return resource file
	 */
	public Resource loadFile(String filename);
	
	/**
	 * Delete file from folder
	 * @param filepath example http://localhost:8080/api/files/d21c0c62-f146-4283-9a1e-aaaef0350c78_exampleFood.png
	 * @return true: delete successfully, false: failed
	 */
	public Boolean deleteFile(String filepath);
}
