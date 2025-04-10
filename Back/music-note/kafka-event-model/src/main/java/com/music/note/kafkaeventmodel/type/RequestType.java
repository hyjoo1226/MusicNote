package com.music.note.kafkaeventmodel.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RequestType {
	MANUAL("수동 요청"),
	AUTOMATIC("자동 요청"),
	WEEKLY("주간 요청"),
	DAILY_ERROR("일일 리포트 생성에 실패했어요."),
	WEEKLY_ERROR("주간 리포트 생성에 실패했어요."),
	CRAWLING_ERROR("음악 데이터 크롤링에 실패했어요."),
	DAILY_REPORTS_NOT_ENOUGH_FOR_WEEKLY("주간 리포트 생성을 위한 일간 리포트가 부족해요."),
	;

	private final String label;

}
