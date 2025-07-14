package com.foodbooking.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class AdminController {

	@GetMapping("/admin/login")
	public String getViewLogin() {
		return "login";
	}
	
	
	@GetMapping("/admin/dashboard")
	public String getViewDashboard() {
		return "dashboard";
	}
}
