package com.music.note.recommend.mapper.like.book;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.book.RecommendBookLikes;

@Component
public class RecommendBookLikeMapper {
	public RecommendBookLikes createRecommendBookLikes(String id, String userId) {
		return RecommendBookLikes.builder()
			.userId(userId)
			.likedBookIds(new ArrayList<>(List.of(id)))
			.build();
	}
}
