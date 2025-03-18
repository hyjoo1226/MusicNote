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
}
