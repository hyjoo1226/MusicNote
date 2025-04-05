package com.music.note.recommend.domain.recommned.movie;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.music.note.recommend.dto.movie.CreditDto;
import com.music.note.recommend.dto.movie.RecommendMovieDto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "recommend_movie")
public class RecommendMovie {
	@Id
	private String id;
	private String overview;
	private String posterPath;
	private String releaseDate;
	private String title;
	private double voteAverage;
	private String userId;
	private List<String> genres;
	private int runtime;
	private List<CreditDto> credits;
	private boolean adult;
	@JsonProperty("backdrop_path")
	private String backdropPath;
	private double popularity;

	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	public RecommendMovieDto EntityToDto(){
		return RecommendMovieDto.builder()
			.id(id)
			.credits(credits)
			.genres(genres)
			.title(title)
			.overview(overview)
			.posterPath(posterPath)
			.runtime(runtime)
			.voteAverage(voteAverage)
			.releaseDate(releaseDate)
			.createdAt(createdAt)
			.popularity(popularity)
			.backdropPath(backdropPath)

			.build();
	}


}