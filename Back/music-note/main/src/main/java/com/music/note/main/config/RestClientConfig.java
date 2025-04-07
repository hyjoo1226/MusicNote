package com.music.note.main.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

	private static final String baseUrl = "https://api.spotify.com";

	@Bean
	public RestClient restClient() {
		return RestClient.builder()
			.baseUrl(baseUrl)
			.build();
	}
}