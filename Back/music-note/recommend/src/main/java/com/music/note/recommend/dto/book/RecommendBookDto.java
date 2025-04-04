package com.music.note.recommend.dto.book;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
public class RecommendBookDto {
	@Setter
	private String id;
	private String title;
	private String author;
	private String description;
	private String isbn;
	private String link;
	private String keyword;
}
