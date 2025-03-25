package com.music.note.common.exception.response;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

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

	// ✅ 기본 에러 응답 생성 (코드 지정)
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
