package com.music.note.musictype.consumer.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AudioFeaturesDto {
	private double tempo;
	private double acousticness;
	private double danceability;
	private double energy;
	private double instrumentalness;
	private double liveness;
	private double loudness;
	private double speechiness;
	private double valence;
}
