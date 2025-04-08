package com.music.note.common.exception.exception.domain.recommend.like.book;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendBookLikesNotFoundException extends BusinessBaseException {
	public RecommendBookLikesNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendBookLikesNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
