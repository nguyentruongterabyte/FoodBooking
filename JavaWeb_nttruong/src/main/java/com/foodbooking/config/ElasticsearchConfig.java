package com.foodbooking.config;

import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {
	@Override
	public ClientConfiguration clientConfiguration() {
		return ClientConfiguration.builder().connectedTo("localhost:9200").build();
	}

	@Bean
	ElasticsearchClient elasticsearchClient() {
		RestClient restClient = RestClient.builder(new org.apache.http.HttpHost("localhost", 9200)).build();

		ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

		return new ElasticsearchClient(transport);
	}
	
	@Bean
	ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		return objectMapper; 
	}
}
