package com.music.note.typedomain.domain;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(collection = "weekly_reports")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyReport {
	@Id
	private String id;

	private String userId;

	@Builder.Default
	private LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

	private Trend trends;

	private String summary;

	private String topGrowth;

	private String topDecline;

	private String topFluctuation;

	private List<Detail> details;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Trend {
		private String openness;
		private String conscientiousness;
		private String extraversion;
		private String agreeableness;
		private String neuroticism;
	}

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Detail {
		private LocalDateTime createdAt;
		private double openness;
		private double conscientiousness;
		private double extraversion;
		private double agreeableness;
		private double neuroticism;
	}
}
