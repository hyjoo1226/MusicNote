package com.music.note.recommend.repository.recommend.like.movie;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;

@Repository
public interface RecommendMovieLikeRepository extends MongoRepository<RecommendMovieLikes, String> {
	Optional<RecommendMovieLikes> findByUserId(String userId);
}
