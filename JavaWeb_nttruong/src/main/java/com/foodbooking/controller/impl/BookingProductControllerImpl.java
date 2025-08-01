package com.foodbooking.controller.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.foodbooking.controller.BookingProductController;
import com.foodbooking.dto.request.BookingProductRequestDTO;
import com.foodbooking.dto.response.ApiResponse;
import com.foodbooking.dto.response.ErrorResponse;
import com.foodbooking.dto.response.PagedResponse;
import com.foodbooking.entity.BookingProduct;
import com.foodbooking.service.BookingProductService;
import com.foodbooking.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/booking-products")
public class BookingProductControllerImpl implements BookingProductController {

	@Autowired
	private BookingProductService bookingProductService;
	
	@Autowired
	private FileStorageService fileStorageService;
	
	/**
	 * @param form form data from client (include image file)
	 * @return API new booking product
	 */
	@Override
	@PostMapping("")
	public ResponseEntity<?> saveBookingProduct(@Valid @ModelAttribute BookingProductRequestDTO form) {
		
		MultipartFile file = form.getImageFile();
		
		// Save image and get image path
		String filepath = fileStorageService.saveImage(file);
		
		// Save new Booking Product
		BookingProduct newBookingProduct = BookingProduct.builder()
				.type(form.getType())
				.name(form.getName())
				.description(form.getDescription())
				.price(form.getPrice())
				.imageUrl(filepath)
				.isDeleted(false)
				.build();
		 
		bookingProductService.saveBookingProduct(newBookingProduct);
		// Return response
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(ApiResponse.builder()
						.status(HttpStatus.CREATED.value())
						.timestamp(LocalDateTime.now())
						.message("Created successfully!")
						.data(newBookingProduct)
						.build()
				);	
		}

	/**
	 * @param isDeleted null: get by admin, false: get by customer
	 * @return total of items
	 */
	@Override
	@GetMapping("/count")
	public ResponseEntity<?> getCountItems(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Boolean isDeleted,
			@RequestParam(defaultValue = "food") String type
			) {
		
		Integer count = bookingProductService.getCount(keyword, isDeleted, type);
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(count)
						.build()
				);
	}

	/**
	 * @param keyword      keyword searching
	 * @param isDeleted    null: get by admin, false: get by customer
	 * @param includeTotal total page
	 * @param priceDESC    sort by price
	 * @param page         start at 1
	 * @param size         items per page
	 * @return API pagination items
	 */
	@Override
	@GetMapping("/{page}/{size}")
	public ResponseEntity<?> getBookingProductsPage(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Boolean isDeleted,
			@RequestParam(defaultValue = "food") String type,
			@RequestParam(required = false) Boolean priceDESC,
			@RequestParam(defaultValue = "false") Boolean useSemantic,
			@RequestParam(defaultValue = "false") Boolean includeTotal, 
			@PathVariable Integer page,
			@PathVariable Integer size
			) {
		List<BookingProduct> bookingProducts = bookingProductService
				.findBookingProductsPage(keyword, isDeleted, type, priceDESC, useSemantic, (page - 1) * size, size);
		
		
		PagedResponse<BookingProduct> pagedResponse = new PagedResponse<>();
		
		// Set current page
		pagedResponse.setPage(page);
		
		// Set items
		pagedResponse.setItems(bookingProducts);
		
		// Include total pages
		if (includeTotal != null && includeTotal) {
			int totalItems = bookingProductService.getCount(keyword, isDeleted, type);
			int totalPages = (int) Math.ceil((double) totalItems / (double)size);
			pagedResponse.setTotalPages(totalPages);
		}
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(pagedResponse)
						.build()
				);
	}

	/**
	 * API update booking product
	 * 
	 * @param id   of product
	 * @param form form data from client (include image file)
	 * @return API updated booking product
	 */
	@Override
	@PutMapping("/{id}")
	public ResponseEntity<?> updateBookingProduct(@PathVariable Long id, @Valid @ModelAttribute BookingProductRequestDTO form) {
		MultipartFile file = form.getImageFile();
		
		// Save new Booking Product
		BookingProduct bookingProductToUpdate = BookingProduct.builder()
				.id(id)
				.type(form.getType())
				.name(form.getName())
				.description(form.getDescription())
				.price(form.getPrice())
				.isDeleted(false)
				.build();
		
		
		if (file != null) {
			// Save image and get image path
			String filepath = fileStorageService.saveImage(file);
			bookingProductToUpdate.setImageUrl(filepath);
		}
		
		// Update
		bookingProductService.updateBookingProduct(bookingProductToUpdate);
		
		// Retrieve updated booking product
		BookingProduct updatedBookingProduct = bookingProductService.findByBookingProductId(id);
		
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Update successfully!")
						.data(updatedBookingProduct)
						.build()
				);
	}

	/**
	 * API delete booking product (update isDeleted = true)
	 * 
	 * @param id id from request
	 * @return message
	 */
	@Override
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBookingProduct(@PathVariable Long id) {
		int rowEffected = 
				bookingProductService.updateBookingProduct(
					BookingProduct.builder()
					.id(id)
					.isDeleted(true)
					.build()
				);
		if (rowEffected == 0)
			throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong while delete booking product!");
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

	/**
	 * API get booking product by id
	 * 
	 * @param id id from request
	 * @return found booking product
	 */
	@Override
	@GetMapping("/{id}")
	public ResponseEntity<?> getByBookingProductId(@PathVariable Long id) {
		BookingProduct foundBookingProduct = bookingProductService.findByBookingProductId(id);			
		
		// Return response
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(ApiResponse.builder()
						.status(HttpStatus.OK.value())
						.timestamp(LocalDateTime.now())
						.message("Retrieve successfully!")
						.data(foundBookingProduct)
						.build()
			);
	}
	
	

}
