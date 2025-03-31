package com.music.note.common.exception.exception.domain.auth;

import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.common.exception.exception.common.ErrorCode;

public class ExternalApiException extends BusinessBaseException {
	public ExternalApiException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}

	public ExternalApiException(ErrorCode errorCode) {
		super(errorCode);
	}

}