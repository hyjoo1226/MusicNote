package com.music.note.recommend.repository.recommend.like.book;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import com.music.note.recommend.domain.like.book.RecommendBookLikes;
import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;

@Repository
public interface RecommendBookLikeRepository extends MongoRepository<RecommendBookLikes, String> {
	@Query("{ '_id': ?0 }")
	@Update("{ '$addToSet': { 'liked_book_ids': ?1 } }")
	void addMovieLike(String recommendBookLikesId, String bookId);

	Optional<RecommendBookLikes> findByUserId(String userId);

	@Query("{ '_id': ?0 }")
	@Update("{ '$pull': { 'liked_book_ids': ?1 } }")
	void removeBookLike(String recommendBookLikesId, String bookId);
}
