package com.music.note.common.exception.exception.domain.recommend.domain.music;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendMusicNotFoundException extends BusinessBaseException {
	public RecommendMusicNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendMusicNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
