package com.music.note.kafkaeventmodel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
