package com.music.note.common.exception.exception.itf;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
	public HttpStatus getHttpStatus();
	public String getCode();
	public String getMessage();
}
