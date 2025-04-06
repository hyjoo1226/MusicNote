package com.music.note.common.exception.exception.domain.personalityreport;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;

public class PersonalityNotFoundException extends BusinessBaseException {
	public PersonalityNotFoundException(String message,
		ErrorCode errorCode) {
		super(message, errorCode);
	}

	public PersonalityNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
