package com.music.note.musictype.consumer.dto.daily;

import java.util.List;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
	private List<MusicData> musicList;

	// 내부 static 클래스
	@Getter
	@Builder
	public static class Report {
		@JsonProperty("top_score")
		private String topScore;

		@JsonProperty("top_text")
		private String topText;

		@JsonProperty("low_score")
		private String lowScore;

		@JsonProperty("low_text")
		private String lowText;

		private String summary;
	}

	@Getter
	@Builder
	public static class MusicData {
		private String spotifyId;
		private String title;
		private String artist;
		private String imageUrl;
	}
}
