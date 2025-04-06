package com.music.note.common.exception.response;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.music.note.common.exception.exception.common.ErrorCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
	private String message;
	private HttpStatus httpStatus;
	private String code;
	private LocalDateTime timestamp;

	public static ErrorResponse of(ErrorCode errorCode) {
		return ErrorResponse.builder()
			.message(errorCode.getMessage())
			.httpStatus(errorCode.getStatus())
			.code(errorCode.getCode())
			.timestamp(LocalDateTime.now())
			.build();
	}

	public static ErrorResponse of(String message, HttpStatus status, String code) {
		return ErrorResponse.builder()
			.message(message)
			.httpStatus(status)
			.code(code)
			.timestamp(LocalDateTime.now())
			.build();
	}

	// ✅ code 없이 간단한 에러 응답
	public static ErrorResponse of(String message, HttpStatus status) {
		return ErrorResponse.builder()
			.message(message)
			.httpStatus(status)
			.code(status.name())
			.timestamp(LocalDateTime.now())
			.build();
	}
}
