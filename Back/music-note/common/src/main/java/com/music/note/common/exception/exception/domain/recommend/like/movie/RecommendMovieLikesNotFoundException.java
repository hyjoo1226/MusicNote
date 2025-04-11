package com.music.note.common.exception.exception.domain.recommend.like.movie;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendMovieLikesNotFoundException extends BusinessBaseException {
	public RecommendMovieLikesNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendMovieLikesNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
