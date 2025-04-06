package com.music.note.musiccrawler.consumer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackDataResponse {
	private Double tempo;
	private Double loudness;
	private Double acousticness;
	private Double danceability;
	private Double energy;
	private Double instrumentalness;
	private Double liveness;
	private Double speechiness;
	private Double valence;
}