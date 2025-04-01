package com.music.note.musictype.consumer.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "personality_reports")
public class PersonalityReport {

	@Id
	private String id;

	private String userId;
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;

	private Report report;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Report {
		private String topScore;
		private String topText;
		private String lowScore;
		private String lowText;
		private String summary;
	}
}