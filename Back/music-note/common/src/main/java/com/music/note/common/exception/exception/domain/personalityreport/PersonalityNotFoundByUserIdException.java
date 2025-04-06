package com.music.note.common.exception.exception.domain.personalityreport;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class PersonalityNotFoundByUserIdException extends BusinessBaseException {
	public PersonalityNotFoundByUserIdException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public PersonalityNotFoundByUserIdException(ErrorCode errorCode) {
		super(errorCode);
	}
}
