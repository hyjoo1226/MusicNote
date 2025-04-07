package com.music.note.musictype.consumer.dto.weekly;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class WeeklyReportRequest {
	private List<BigFiveDto> bigFiveList;
}
