package com.music.note.common.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.music.note.common.exception.exception.domain.auth.ExternalApiException;
import com.music.note.common.exception.exception.domain.auth.SocialLoginException;
import com.music.note.common.exception.exception.domain.auth.TokenParsingException;
import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.jwt.JwtTokenException;
import com.music.note.common.exception.response.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleServerException(Exception ex) {
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ErrorResponse.of("서버 내부 오류가 발생했습니다.",
				HttpStatus.INTERNAL_SERVER_ERROR,
				"INTERNAL_SERVER_ERROR"));
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

	@ExceptionHandler(JwtTokenException.class)
	public ResponseEntity<ErrorResponse> handleSocialLoginException(JwtTokenException ex) {

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
