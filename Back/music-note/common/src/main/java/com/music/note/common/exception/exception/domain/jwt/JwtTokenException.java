package com.music.note.common.exception.exception.domain.jwt;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class JwtTokenException extends BusinessBaseException {

	public JwtTokenException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}
	public JwtTokenException(ErrorCode errorCode) {
		super(errorCode);
	}

}
