package com.music.note.recommend.repository.recommend.like.book;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import com.music.note.recommend.domain.like.book.RecommendBookLikes;

public interface RecommendBookLikeRepository extends MongoRepository<RecommendBookLikes, String> {
	@Query("{ '_id': ?0 }")
	@Update("{ '$addToSet': { 'liked_book_ids': ?1 } }")
	void addMovieLike(String recommendBookLikesId, String bookId);
}
