package com.foodbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountDTO {
	
	@NotNull(message = "Please provide password.")
	@NotBlank(message = "Please enter password.")
	private String password;
	
	@NotNull(message = "Please provide new password.")
	@NotBlank(message = "Please enter new password.")
	private String newPassword;
}
