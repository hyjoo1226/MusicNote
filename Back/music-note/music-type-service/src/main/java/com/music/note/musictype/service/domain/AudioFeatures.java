package com.music.note.musictype.service.domain;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class AudioFeatures {
	@Field("valence")
	private double valence;

	@Field("acousticness")
	private double acousticness;

	@Field("instrumentalness")
	private double instrumentalness;

	@Field("speechiness")
	private double speechiness;

	@Field("liveness")
	private double liveness;

	@Field("tempo")
	private double tempo;
	
	@Field("energy")
	private double energy;

	@Field("loudness")
	private double loudness;

	@Field("danceability")
	private double danceability;
}
