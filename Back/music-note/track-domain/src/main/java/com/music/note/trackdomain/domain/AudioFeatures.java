package com.music.note.trackdomain.domain;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AudioFeatures {

	@Field("tempo")
	private double tempo;

	@Field("acousticness")
	private double acousticness;

	@Field("danceability")
	private double danceability;

	@Field("energy")
	private double energy;

	@Field("instrumentalness")
	private double instrumentalness;

	@Field("liveness")
	private double liveness;

	@Field("loudness")
	private double loudness;

	@Field("speechiness")
	private double speechiness;

	@Field("valence")
	private double valence;

}
