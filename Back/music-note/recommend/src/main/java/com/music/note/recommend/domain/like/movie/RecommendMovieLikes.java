package com.music.note.recommend.domain.like.movie;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "recommend_movie_likes")
public class RecommendMovieLikes {
	@Id
	private String id;
	private List<String> likedMusicIds = new ArrayList<>();
	private String userId;
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	public void addLike(String musicId) {
		if (!likedMusicIds.contains(musicId)) {
			likedMusicIds.add(musicId);
		}
	}

	public void removeLike(String musicId) {
		likedMusicIds.remove(musicId);
	}
}
