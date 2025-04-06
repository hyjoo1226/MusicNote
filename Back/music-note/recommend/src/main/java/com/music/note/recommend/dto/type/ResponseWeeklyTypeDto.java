package com.music.note.recommend.dto.type;

import java.util.ArrayList;
import java.util.List;

import com.music.note.recommend.dto.report.ResponseReportDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ResponseWeeklyTypeDto {
	private List<TrendTypeDto> trendTypeDtoList = new ArrayList<>();
	private int listSize;
}
