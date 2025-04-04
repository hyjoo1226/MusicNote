package com.music.note.recommend.dto.report;

import java.time.LocalDateTime;

import com.music.note.recommend.dto.type.TypeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ResponseReportWithTypeDto {
	private LocalDateTime createdAt;
	private String reportId;
	private TypeDto typeDto;
}
