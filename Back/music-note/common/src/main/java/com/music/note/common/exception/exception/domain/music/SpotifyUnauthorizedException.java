package com.music.note.common.exception.exception.domain.music;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class SpotifyUnauthorizedException extends BusinessBaseException {

	public SpotifyUnauthorizedException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}

	public SpotifyUnauthorizedException(ErrorCode errorCode) {
		super(errorCode);
	}
}
