package com.music.note.recommend.mapper.domain.book;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.recommned.book.RecommendBook;
import com.music.note.recommend.dto.book.RecommendBookDto;

@Component
public class RecommendBookMapper {
	public RecommendBook dtoToEntity(RecommendBookDto dto, String userId) {
		return RecommendBook.builder()
			.isbn(dto.getIsbn())
			.link(dto.getLink())
			.author(dto.getAuthor())
			.title(dto.getTitle())
			.description(dto.getDescription())
			.keyword(dto.getKeyword())
			.userId(userId)
			.build();

	}
}
