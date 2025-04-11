package com.music.note.musiccrawler.consumer.dto;

import java.util.List;

import lombok.Data;

@Data
public class RawTrackDataResponse {
	private List<String> scores;

	public TrackDataResponse toStructuredResponse() {
		validateScores();

		return TrackDataResponse.builder()
			.tempo(parse(scores.get(0), false))
			// .key(scores.get(1))
			// .camelot(scores.get(2))
			// .popularity(scores.get(3))
			.loudness(parse(scores.get(4), false))
			.acousticness(parse(scores.get(5), true))
			.danceability(parse(scores.get(6), true))
			.energy(parse(scores.get(7), true))
			.instrumentalness(parse(scores.get(8), true))
			.liveness(parse(scores.get(9), true))
			// .loudness(scores.get(10))
			.speechiness(parse(scores.get(11), true))
			.valence(parse(scores.get(12), true))
			// .isrc(scores.get(13))
			// .label(scores.get(14))
			.build();
	}

	private void validateScores() {
		if (scores == null || scores.size() < 14) {
			throw new IllegalStateException("Invalid scores size");
		}
	}

	private Double parse(String raw, boolean scaleBy100) {
		if (raw == null)
			return null;
		String cleaned = raw.replaceAll("[^\\d.\\-]", "");
		if (cleaned.isEmpty())
			return null;
		double value = Double.parseDouble(cleaned);
		return scaleBy100 ? value / 100 : value;
	}
}