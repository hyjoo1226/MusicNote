package com.music.note.common.exception.exception.domain.auth;

import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.common.exception.exception.common.ErrorCode;

public class SocialLoginException extends BusinessBaseException {
	public SocialLoginException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}

	public SocialLoginException(ErrorCode errorCode) {
		super(errorCode);
	}
}
