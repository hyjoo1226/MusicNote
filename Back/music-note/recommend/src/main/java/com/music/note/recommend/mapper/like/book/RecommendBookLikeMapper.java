package com.music.note.recommend.mapper.like.book;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.book.RecommendBookLikes;

@Component
public class RecommendBookLikeMapper {
	public RecommendBookLikes createRecommendBookLikes(String isbn, String userId) {
		return RecommendBookLikes.builder()
			.userId(userId)
			.likedIsbns(new ArrayList<>(List.of(isbn)))
			.createdAt(LocalDateTime.now())
			.build();
	}
}
