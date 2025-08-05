package com.foodbooking.service.impl;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.service.FileStorageService;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;

@Service
public class FileStorageServiceImpl implements FileStorageService {

	@Value("${file.upload-dir}")
	private String uploadDir;

	private static final Long MAX_IMAGE_FILE_SIZE = (long) (5 * 1024 * 1024);
	private static final String PREFIX_FILE_PATH = "http://localhost:8080/api/files/";
	private static final String FIREBASE_URL_PREFIX = "https://storage.googleapis.com/hatshop-bc917.appspot.com/";
	private static final String FIREBASE_BUCKET_NAME = "hatshop-bc917.appspot.com";
	
	/**
	 * Extract Filename from file path 
	 * @param filePath example: http://localhost:8080/api/files/d21c0c62-f146-4283-9a1e-aaaef0350c78_exampleFood.png
	 * @return filename example: d21c0c62-f146-4283-9a1e-aaaef0350c78_exampleFood.png
	 */
	private String extractFilename(String filePath) {
		if (filePath != null && filePath.startsWith(PREFIX_FILE_PATH)) {
			String filename = filePath.substring(PREFIX_FILE_PATH.length());
			return filename;
		}
		throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid file path.");
	}
	
	/**
	 * @param file file upload from client
	 * @return string of path file
	 */
	@Override
	public String saveFile(MultipartFile file) throws IOException {


		// Create new file
		String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
		
		// Upload to firebase
		Bucket bucket = StorageClient.getInstance().bucket(FIREBASE_BUCKET_NAME);
		bucket.create(filename, file.getBytes(), file.getContentType());
		
		return FIREBASE_URL_PREFIX + filename; // return filename
	}

	/**
	 * @param filename filename from client
	 * @return resource file
	 */

	@Override
	public Resource loadFile(String filename) {

		try {
			// If file from fire base => do not load local, client fetch by URL
			if (filename.startsWith(FIREBASE_URL_PREFIX)) {
				return null;
			}
			
			// Local file
			Path file = Paths.get(uploadDir).resolve(filename);
			Resource resource = new UrlResource(file.toUri());
			return resource.exists() ? resource : null;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * @param imageFile image file upload from client
	 * @return string of image path
	 */
	@Override
	public String saveImage(MultipartFile imageFile) {
		try {

			// Check max file size
			if (imageFile.getSize() > MAX_IMAGE_FILE_SIZE)
				throw new ErrorResponse(HttpStatus.BAD_REQUEST, "The max size of image must less than 5MB.");

			// Check image format (JPEG, PNG)
			String contentType = imageFile.getContentType();
			if (!Objects.equals(contentType, "image/jpeg") && !Objects.equals(contentType, "image/png"))
				throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Only support JPEG & PNG image.");

			// Check size (width, height): square image
			BufferedImage image = ImageIO.read(imageFile.getInputStream());
			if (image == null)
				throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid image file.");

			if (image.getWidth() != image.getHeight())
				throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Please upload square image.");

			String fileUrl = saveFile(imageFile);

			return fileUrl;
		} catch (IOException e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}

	}

	/**
	 * Delete file from folder
	 * @param filepath example http://localhost:8080/api/files/d21c0c62-f146-4283-9a1e-aaaef0350c78_exampleFood.png
	 * @return true: delete successfully, false: failed
	 */
	@Override
	public Boolean deleteFile(String filePath) {
		try {
			
			if (filePath.startsWith(FIREBASE_URL_PREFIX)) {
				// Fire base
				String filename = filePath.substring(FIREBASE_URL_PREFIX.length());
				Bucket bucket = StorageClient.getInstance().bucket(FIREBASE_BUCKET_NAME);
				return bucket.get(filename).delete();
			} else {
				// Local
				String filename = extractFilename(filePath);
				Path localFilePath = Paths.get(uploadDir).resolve(filename);
				return Files.deleteIfExists(localFilePath);
			}
			
		} catch (IOException e) {
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file: " + e.getMessage());
		}
	}

}
