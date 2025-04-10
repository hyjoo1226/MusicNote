package com.music.note.musictype.consumer.dto.daily;

import java.time.LocalDateTime;
import java.util.List;

import com.music.note.typedomain.domain.ManualReport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ManualReportResponse {
	private String id;
	private String userId;
	private LocalDateTime createdAt;

	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;

	private ReportDto report;
	private List<MusicDto> musicList;

	public static ManualReportResponse from(ManualReport report) {
		return ManualReportResponse.builder()
			.id(report.getId())
			.userId(report.getUserId())
			.createdAt(report.getCreatedAt())
			.openness(report.getOpenness())
			.conscientiousness(report.getConscientiousness())
			.extraversion(report.getExtraversion())
			.agreeableness(report.getAgreeableness())
			.neuroticism(report.getNeuroticism())
			.report(ReportDto.builder()
				.topScore(report.getReport().getTopScore())
				.topText(report.getReport().getTopText())
				.lowScore(report.getReport().getLowScore())
				.lowText(report.getReport().getLowText())
				.summary(report.getReport().getSummary())
				.build())
			.musicList(report.getMusicList().stream()
				.map(m -> MusicDto.builder()
					.spotifyId(m.getSpotifyId())
					.title(m.getTitle())
					.artist(m.getArtist())
					.imageUrl(m.getImageUrl())
					.build())
				.toList())
			.build();
	}

	@Getter
	@AllArgsConstructor
	@Builder
	public static class ReportDto {
		private String topScore;
		private String topText;
		private String lowScore;
		private String lowText;
		private String summary;
	}

	@Getter
	@AllArgsConstructor
	@Builder
	public static class MusicDto {
		private String spotifyId;
		private String title;
		private String artist;
		private String imageUrl;
	}
}

