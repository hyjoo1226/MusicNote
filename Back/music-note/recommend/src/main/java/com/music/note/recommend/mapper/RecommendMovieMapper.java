package com.music.note.recommend.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.RecommendMovie;
import com.music.note.recommend.dto.movie.MovieRecommendDto;

@Component
public class RecommendMovieMapper {
	public RecommendMovie dtoToEntity(MovieRecommendDto recommendDto, String userId) {
		List<String> genres = new ArrayList<>(recommendDto.getGenres());
		return RecommendMovie.builder()
			.title(recommendDto.getTitle())
			.posterPath(recommendDto.getPosterPath())
			.voteAverage(recommendDto.getVoteAverage())
			.overview(recommendDto.getOverview())
			.releaseDate(recommendDto.getReleaseDate())
			.userId(userId)
			.genres(genres)
			.build();
	}
}
