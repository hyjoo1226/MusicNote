package com.music.note.recommend.dto.report;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ResponseReportList {
	private List<ResponseReportWithTypeDto> responseTypeWithReportIds = new ArrayList<>();
	private int listSize;

}

