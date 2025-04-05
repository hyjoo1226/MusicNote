package com.music.note.recommend.dto.book;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RecommendBookDto {
	@Setter
	private String id;
	private String title;
	private String author;
	private String description;
	private String publisher;
	private String isbn;
	@Setter
	private String userId;
	private String pubdate;
	private String image;
}
