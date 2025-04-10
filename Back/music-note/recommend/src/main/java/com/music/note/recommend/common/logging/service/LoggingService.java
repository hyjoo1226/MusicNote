package com.music.note.recommend.common.logging.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.note.recommend.common.logging.dto.LogEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoggingService {
	private final ObjectMapper objectMapper;

	private final Logger logger = LoggerFactory.getLogger("ELK_LOGGER");
	public void log(LogEvent event) {
		try {
			String json = objectMapper.writeValueAsString(event);
			logger.info(json);
		} catch (JsonProcessingException e) {
			logger.error("Failed to serialize LogEvent", e);
		}
	}
}
