package com.music.note.recommend.mapper.like.music;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.like.music.RecommendMusicLikes;

@Component
public class RecommendMusicLikeMapper {
	public RecommendMusicLikes createRecommendMusicLikes(String spotifyMusicId, String userId) {
		return RecommendMusicLikes.builder()
			.likeMusicSpotifyMusicIds(new ArrayList<>(List.of(spotifyMusicId)))
			.userId(userId)
			.createdAt(LocalDateTime.now())
			.build();
	}
}
