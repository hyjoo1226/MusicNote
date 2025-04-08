package com.music.note.kafkaeventmodel.dto;

import com.music.note.kafkaeventmodel.type.RequestType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportEvent {
	private Long userId;
	private int year;
	private int month;
	private int day;
	private RequestType type;
}
