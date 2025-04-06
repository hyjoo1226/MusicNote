package com.music.note.common.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.auth.ExternalApiException;
import com.music.note.common.exception.exception.domain.auth.SocialLoginException;
import com.music.note.common.exception.exception.domain.auth.TokenParsingException;
import com.music.note.common.exception.response.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleServerException(Exception exception) {
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR));
	}

	@ExceptionHandler(TokenParsingException.class)
	public ResponseEntity<ErrorResponse> handleTokenException(TokenParsingException ex) {

		ErrorCode errorCode = ex.getErrorCode();

		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.of(
				errorCode.getMessage(),
				errorCode.getStatus(),
				errorCode.getCode()
			));
	}

	@ExceptionHandler(ExternalApiException.class)
	public ResponseEntity<ErrorResponse> handleExternalApiException(ExternalApiException ex) {

		ErrorCode errorCode = ex.getErrorCode();

		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.of(
				errorCode.getMessage(),
				errorCode.getStatus(),
				errorCode.getCode()
			));
	}

	@ExceptionHandler(SocialLoginException.class)
	public ResponseEntity<ErrorResponse> handleSocialLoginException(SocialLoginException ex) {

		ErrorCode errorCode = ex.getErrorCode();

		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.of(
				errorCode.getMessage(),
				errorCode.getStatus(),
				errorCode.getCode()
			));
	}

}
