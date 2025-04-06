package com.music.note.recommend.repository.recommend.movie;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.recommned.book.RecommendBook;
import com.music.note.recommend.domain.recommned.movie.RecommendMovie;

@Repository
public interface RecommendMovieRepository extends MongoRepository<RecommendMovie,String> {
	List<RecommendMovie> findTop20ByUserIdOrderByCreatedAtDesc(String userId);
}
