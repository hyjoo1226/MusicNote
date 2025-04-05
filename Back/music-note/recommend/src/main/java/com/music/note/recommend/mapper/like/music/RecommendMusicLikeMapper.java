package com.music.note.recommend.mapper.like.music;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.music.RecommendMusicLikes;

@Component
public class RecommendMusicLikeMapper {
	public RecommendMusicLikes createRecommendMusicLikes(String recommendMusicId, String userId) {
		return RecommendMusicLikes.builder()
			.likeMusicIds(new ArrayList<>(List.of(recommendMusicId)))
			.userId(userId)
			.build();
	}
}
