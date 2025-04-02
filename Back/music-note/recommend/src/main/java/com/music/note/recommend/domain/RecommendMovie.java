package com.music.note.recommend.domain;

import java.time.LocalDateTime;
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
@Document(collection = "recommend_movie")
public class RecommendMovie {
	@Id
	private String id;
	private String overview;
	private String posterPath;
	private String releaseDate;
	private String title;
	private double voteAverage;
	private String userId;
	private List<String> genres;

	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

}