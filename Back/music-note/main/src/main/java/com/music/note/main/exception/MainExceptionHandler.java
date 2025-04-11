package com.music.note.main.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.common.exception.response.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class MainExceptionHandler {

	@ExceptionHandler(BusinessBaseException.class)
	public ResponseEntity<ErrorResponse> handleBusinessBaseException(BusinessBaseException exception) {
		return ResponseEntity
			.status(exception.getErrorCode().getStatus())
			.body(ErrorResponse.of(exception.getErrorCode()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleServerException(Exception exception) {
		log.info("Server Error: {}", exception.getMessage());
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR));
	}
}
