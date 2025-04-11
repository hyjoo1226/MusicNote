package com.music.note.recommend.dto.like.book.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RequestRecommendBookLikeDto {
	private String recommendBookId;
	private String isbn;
}
