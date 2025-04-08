package com.music.note.musictype.consumer.dto.weekly;

import java.time.LocalDateTime;

import com.music.note.typedomain.domain.WeeklyReport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailDto {
	private LocalDateTime createdAt;
	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;

	public static DetailDto fromEntity(WeeklyReport.Detail detail) {
		return DetailDto.builder()
			.createdAt(detail.getCreatedAt())
			.openness(detail.getOpenness())
			.conscientiousness(detail.getConscientiousness())
			.extraversion(detail.getExtraversion())
			.agreeableness(detail.getAgreeableness())
			.neuroticism(detail.getNeuroticism())
			.build();
	}
}
