package com.foodbooking.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateFormatter {
	/**
	 * Format local date time to string
	 * 
	 * @param dateTime 
	 * @return String pattern
	 */
	public static String formatDate(LocalDateTime dateTime) {
		String pattern = "dd MMM yyyy";

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		return dateTime.format(formatter);
	}
}
