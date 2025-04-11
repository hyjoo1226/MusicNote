package com.music.note.recommend.repository.recommend.like.movie;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;

@Repository
public interface RecommendMovieLikeRepository extends MongoRepository<RecommendMovieLikes, String> {
	Optional<RecommendMovieLikes> findByUserId(String userId);
	@Query("{ '_id': ?0 }")
	@Update("{ '$addToSet': { 'liked_movie_ids': ?1 } }")
	void addMovieLike(String recommendMovieLikesId, String movieId);

	@Query("{ '_id': ?0 }")
	@Update("{ '$addToSet': { 'liked_tmdb_movie_ids': ?1 } }")
	void addTmdbMovieLike(String recommendMovieLikesId, int tmdbMovieId);
	@Query("{ '_id': ?0 }")
	@Update("{ '$pull': { 'liked_movie_ids': ?1 } }")
	void removeMovieLike(String recommendMovieLikesId, String MovieId);
	@Query("{ '_id': ?0 }")
	@Update("{ '$pull': { 'liked_tmdb_movie_ids': ?1 } }")
	void removeTmdbMovieLike(String recommendMovieLikesId, int tmdbMovieId);
}
