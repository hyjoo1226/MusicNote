package com.music.note.recommend.mapper.like.movie;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;

@Component
public class RecommendMovieLikeMapper {
	public RecommendMovieLikes createRecommendMovieLikes(String id, String userId) {
		return RecommendMovieLikes.builder()
			.likedMovieIds(new ArrayList<>(List.of(id)))
			.userId(userId)
			.createdAt(LocalDateTime.now())
			.build();
	}
}
