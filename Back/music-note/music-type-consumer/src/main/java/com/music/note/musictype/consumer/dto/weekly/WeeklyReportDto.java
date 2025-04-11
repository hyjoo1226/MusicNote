package com.music.note.musictype.consumer.dto.weekly;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportDto {

	private Trends trends;
	private String summary;
	private String top_growth;
	private String top_decline;
	private String top_fluctuation;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Trends {
		private String openness;
		private String conscientiousness;
		private String extraversion;
		private String agreeableness;
		private String neuroticism;
	}
}
