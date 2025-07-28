package com.foodbooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.foodbooking.dto.response.OrderMessage;

@Controller
public class OrderWebSocketController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@MessageMapping("/order")
	public void sendOrderNotification(OrderMessage message) {
		// Send to topic for administrator
		messagingTemplate.convertAndSend("/topic/orders",message);
	}
	
	@MessageMapping("/order-status")
	public void sendOrderStatusNotification(OrderMessage message) {
		// Send to topic for customer
		messagingTemplate.convertAndSend("/topic/orders/status", message);
	}
	
	
}
