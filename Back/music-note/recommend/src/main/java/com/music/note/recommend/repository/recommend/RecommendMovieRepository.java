package com.music.note.recommend.repository.recommend;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.music.note.recommend.domain.RecommendMovie;

public interface RecommendMovieRepository extends MongoRepository<RecommendMovie,String> {
}
