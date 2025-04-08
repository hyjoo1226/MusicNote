package com.music.note.kafkaeventmodel.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RequestType {
	MANUAL("수동 요청"),
	AUTOMATIC("자동 요청"),
	WEEKLY("주간 요청");

	private final String label;

}
