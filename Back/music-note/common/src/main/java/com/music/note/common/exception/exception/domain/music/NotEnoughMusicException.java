package com.music.note.common.exception.exception.domain.music;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class NotEnoughMusicException extends BusinessBaseException {
	public NotEnoughMusicException(String message, ErrorCode errorCode) {
		super(message, errorCode);
	}

	public NotEnoughMusicException(ErrorCode errorCode) {
		super(errorCode);
	}
}
