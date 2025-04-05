package com.music.note.recommend.domain.recommned.book;

import java.time.LocalDateTime;

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
@Document(collection = "recommend_book")
public class RecommendBook {
	@Id
	private String id;
	private String title;
	private String author;
	private String description;
	private String isbn;
	private String userId;
	private String pubdate;
	private String image;
	private String publisher;
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();
}

