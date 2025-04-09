package com.music.note.recommend.mapper.like.movie;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;

@Component
public class RecommendMovieLikeMapper {
	public RecommendMovieLikes createRecommendMovieLikes(Integer tmdbId, String userId) {
		return RecommendMovieLikes.builder()
			.likedTmdbMovieIds(new ArrayList<>(List.of(tmdbId)))
			.userId(userId)
			.createdAt(LocalDateTime.now())
			.build();
	}
}
