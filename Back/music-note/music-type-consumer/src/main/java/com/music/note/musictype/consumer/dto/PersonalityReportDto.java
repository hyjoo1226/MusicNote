package com.music.note.musictype.consumer.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PersonalityReportDto {
	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;
	private Report report;

	// 내부 static 클래스
	@Getter
	@Builder
	public static class Report {
		private String topScore;
		private String topText;
		private String lowScore;
		private String lowText;
		private String summary;
	}
}
