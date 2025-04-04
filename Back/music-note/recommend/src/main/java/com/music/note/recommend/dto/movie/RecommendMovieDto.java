package com.music.note.recommend.dto.movie;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@ToString
public class RecommendMovieDto {
	private List<String> genres = new ArrayList<>();
	@Setter
	private String id;
	private String overview;
	@JsonProperty("poster_path")
	private String posterPath;
	@JsonProperty("release_date")
	private String releaseDate;
	private String title;
	@JsonProperty("vote_average")
	private double voteAverage;
	private int runtime;
	private List<CreditDto> credits = new ArrayList<>();
	private boolean adult;

	@JsonProperty("backdrop_path")
	private String backdropPath;
	private double popularity;
	private LocalDateTime createdAt;
}
