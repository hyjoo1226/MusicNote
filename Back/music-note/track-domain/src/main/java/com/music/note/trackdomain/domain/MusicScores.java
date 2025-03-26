package com.music.note.trackdomain.domain;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class MusicScores {
	@Field("mellow")
	private double mellow;

	@Field("unpretentious")
	private double unpretentious;

	@Field("sophisticated")
	private double sophisticated;

	@Field("intense")
	private double intense;

	@Field("contemporary")
	private double contemporary;
}
