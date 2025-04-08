package com.music.note.recommend.repository.recommend.music;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.recommned.movie.RecommendMovie;
import com.music.note.recommend.domain.recommned.music.RecommendMusic;

@Repository
public interface RecommendMusicRepository extends MongoRepository<RecommendMusic, String> {

	List<RecommendMusic> findTop20ByUserIdOrderByCreatedAtDesc(String userId);
}
