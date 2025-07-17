package com.foodbooking.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PagedResponse<T> {
	private List<T> items;
	private Integer page;
	private Integer totalPages;
}
