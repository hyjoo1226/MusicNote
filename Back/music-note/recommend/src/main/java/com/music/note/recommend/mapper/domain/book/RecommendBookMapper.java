package com.music.note.recommend.mapper.domain.book;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.recommned.book.RecommendBook;
import com.music.note.recommend.dto.book.RecommendBookDto;

@Component
public class RecommendBookMapper {
	public RecommendBook dtoToEntity(RecommendBookDto dto, String userId) {
		return RecommendBook.builder()
			.isbn(dto.getIsbn())
			.author(dto.getAuthor())
			.title(dto.getTitle())
			.description(dto.getDescription())
			.userId(userId)
			.publisher(dto.getPublisher())
			.image(dto.getImage())
			.pubdate(dto.getPubdate())
			.publisher(dto.getPublisher())
			.build();

	}

	public RecommendBookDto entityToDto(String userId, RecommendBook recommendBook) {
		return RecommendBookDto.builder()
			.id(recommendBook.getId())
			.userId(userId)
			.author(recommendBook.getAuthor())
			.description(recommendBook.getDescription())
			.image(recommendBook.getImage())
			.pubdate(recommendBook.getPubdate())
			.isbn(recommendBook.getIsbn())
			.title(recommendBook.getTitle())
			.publisher(recommendBook.getPublisher())
			.build();
	}
}
