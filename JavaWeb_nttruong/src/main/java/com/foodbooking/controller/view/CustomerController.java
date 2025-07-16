package com.foodbooking.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomerController {
	
	@GetMapping("/delivery")
	public String getDeliveryPage() {
		return "delivery";
	}
}
