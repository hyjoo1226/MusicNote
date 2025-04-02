package com.music.note.recommend.dto.movie;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieRecommendDto {
	private List<Integer> genreIds;
	private int id;
	private String overview;
	private String posterPath;
	private String releaseDate;
	private String title;
	private double voteAverage;
}
