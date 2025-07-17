package com.foodbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class AdminController {

	@GetMapping("/admin")
	public String getViewAdmin() {
		return "admin";
	}
	
	@GetMapping("/admin/login")
	public String getViewLogin() {
		return "login";
	}
	
	@GetMapping("/admin/dashboard")
	public String getViewDashboard() {
		return "admin";
	}
	
	@GetMapping("/admin/manage-item")
	public String getViewManageItem() {
		return "admin";
	}
	
	@GetMapping("/admin/change-password")
	public String getViewChangePassword() {
		return "admin";
	}
}
