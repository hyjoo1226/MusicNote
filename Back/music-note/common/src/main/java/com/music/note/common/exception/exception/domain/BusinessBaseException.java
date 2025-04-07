package com.music.note.common.exception.exception.domain;

import com.music.note.common.exception.exception.common.ErrorCode;

public class BusinessBaseException extends RuntimeException {
	private final ErrorCode errorCode;

	public BusinessBaseException(String message, final ErrorCode errorCode) {
		super(message);
		this.errorCode = errorCode;
	}
	public BusinessBaseException(final ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}

	public ErrorCode getErrorCode() {
		return errorCode;
	}
}