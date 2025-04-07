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
import lombok.ToString;

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
	private LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;

	private Report report;
	private List<MusicData> musicList;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	@ToString
	public static class Report {
		private String topScore;
		private String topText;
		private String lowScore;
		private String lowText;
		private String summary;
	}

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	@ToString
	public static class MusicData {
		private String spotifyId;
		private String title;
		private String artist;
		private String imageUrl;
	}
}