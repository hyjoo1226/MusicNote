package com.music.note.common.exception.exception.domain.recommend.domain.book;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class RecommendBookNotFoundException extends BusinessBaseException {
	public RecommendBookNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public RecommendBookNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
