package com.music.note.recommend.domain.recommned.music;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "recommend_music")
public class RecommendMusic {

	@Id
	private String id;

	private String trackName;

	private String artistName;

	private String albumCoverPath;

	private String releaseDate;

	private int durationMs;

	private String userId;

	private String spotifyMusicId;

	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();
}
