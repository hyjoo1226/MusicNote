package com.music.note.recommend.dto.movie;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
public class MovieRecommendDto {
	private List<String> genres;
	private int id;
	private String overview;
	@JsonProperty("poster_path")
	private String posterPath;
	@JsonProperty("release_date")
	private String releaseDate;
	private String title;
	@JsonProperty("vote_average")
	private double voteAverage;
	@JsonProperty("run_time")
	private int runtime;
	private List<CreditDto> credits; // 추가 (출연진 정보)
}
