package com.music.note.common.exception.exception.domain.recommend.like.music;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendMusicLikesNotFoundException extends BusinessBaseException {
	public RecommendMusicLikesNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendMusicLikesNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
