package com.music.note.common.exception.exception.domain.auth;

import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.common.exception.exception.common.ErrorCode;

public class TokenParsingException extends BusinessBaseException {

	public TokenParsingException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}
	public TokenParsingException(ErrorCode errorCode) {
		super(errorCode);
	}

}
