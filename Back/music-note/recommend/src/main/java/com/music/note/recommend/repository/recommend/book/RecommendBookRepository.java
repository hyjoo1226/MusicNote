package com.music.note.recommend.repository.recommend.book;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.recommned.book.RecommendBook;

@Repository
public interface RecommendBookRepository extends MongoRepository<RecommendBook, String> {
}
