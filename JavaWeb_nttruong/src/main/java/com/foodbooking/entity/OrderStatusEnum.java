package com.foodbooking.entity;

public enum OrderStatusEnum {
	
	NEW(1),
	SHIPPING(2),
	CANCELLED(3),
	COMPLETED(4);
	
	private final int id;
	
	OrderStatusEnum(int id) {
		this.id = id;
	}
	
	public int getId() {
		return id;
	}
	
	public static OrderStatusEnum fromId(int id) {
		for (OrderStatusEnum status : OrderStatusEnum.values()) {
			if (status.id == id) {
				return status;
			}
		}
		throw new IllegalArgumentException("Invalid Order Status id: " + id);
	}
}
