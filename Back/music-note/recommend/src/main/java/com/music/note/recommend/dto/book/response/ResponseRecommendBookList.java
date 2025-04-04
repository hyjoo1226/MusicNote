package com.music.note.recommend.dto.book.response;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.music.note.recommend.dto.book.RecommendBookDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseRecommendBookList {

	private List<RecommendBookDto> books = new ArrayList<>(); ;
	private int listSize;

	public void allocateListSize(){
		this.listSize = books.size();
	}
}
