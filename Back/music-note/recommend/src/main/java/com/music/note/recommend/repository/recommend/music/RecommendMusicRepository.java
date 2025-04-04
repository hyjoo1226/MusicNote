package com.music.note.recommend.repository.recommend.music;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.recommned.music.RecommendMusic;

@Repository
public interface RecommendMusicRepository extends MongoRepository<RecommendMusic, String> {
}
