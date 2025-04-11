package com.music.note.recommend.domain.like.book;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "recommend_book_likes")
public class RecommendBookLikes {
	@Id
	private String id;
	@Field("liked_isbn_ids") // 필드명 지정
	private List<String> likedIsbns = new ArrayList<>();
	private String userId;
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();
	public boolean isLiked(String isbn) {
		return likedIsbns.contains(isbn);
	}
}

