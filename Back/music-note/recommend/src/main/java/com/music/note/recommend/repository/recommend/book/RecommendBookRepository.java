package com.music.note.recommend.repository.recommend.book;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.recommned.book.RecommendBook;

@Repository
public interface RecommendBookRepository extends MongoRepository<RecommendBook, String> {
	List<RecommendBook> findTop20ByUserIdOrderByCreatedAtDesc(String userId);
}
