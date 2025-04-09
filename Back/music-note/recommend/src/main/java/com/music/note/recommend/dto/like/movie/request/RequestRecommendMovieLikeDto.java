package com.music.note.recommend.dto.like.movie.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RequestRecommendMovieLikeDto {
	private int tmdbMovieId;
	private String recommendMovieId;
}
