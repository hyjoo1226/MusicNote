package com.music.note.recommend.mapper.domain.movie;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.recommned.movie.RecommendMovie;
import com.music.note.recommend.dto.movie.CreditDto;
import com.music.note.recommend.dto.movie.RecommendMovieDto;

@Component
public class RecommendMovieMapper {
	public RecommendMovie dtoToEntity(RecommendMovieDto recommendDto, String userId) {
		List<String> genres = new ArrayList<>(recommendDto.getGenres());
		List<CreditDto> credits = new ArrayList<>(recommendDto.getCredits());
		return RecommendMovie.builder()
			.title(recommendDto.getTitle())
			.posterPath(recommendDto.getPosterPath())
			.voteAverage(recommendDto.getVoteAverage())
			.overview(recommendDto.getOverview())
			.releaseDate(recommendDto.getReleaseDate())
			.userId(userId)
			.genres(genres)
			.runtime(recommendDto.getRuntime())
			.credits(credits)
			.createdAt(recommendDto.getCreatedAt())
			.popularity(recommendDto.getPopularity())
			.build();
	}
}
