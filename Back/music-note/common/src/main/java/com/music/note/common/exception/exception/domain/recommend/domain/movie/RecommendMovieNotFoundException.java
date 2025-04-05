package com.music.note.common.exception.exception.domain.recommend.domain.movie;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendMovieNotFoundException extends BusinessBaseException {
	public RecommendMovieNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendMovieNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
