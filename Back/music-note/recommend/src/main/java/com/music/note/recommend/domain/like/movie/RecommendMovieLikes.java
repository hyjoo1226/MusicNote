package com.music.note.recommend.domain.like.movie;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "recommend_movie_likes")
public class RecommendMovieLikes {
	@Id
	private String id;
	@Field("liked_movie_ids")
	private List<String> likedMovieIds = new ArrayList<>();
	@Field("liked_tmdb_movie_ids")
	private List<Integer> likedTmdbMovieIds = new ArrayList<>();
	private String userId;
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	public boolean isLiked(String movieId) {
		return likedMovieIds.contains(movieId);
	}
	public boolean isLikedTMDBMovie(int tmdbMovieId) {
		return likedTmdbMovieIds.contains(tmdbMovieId);
	}

}
