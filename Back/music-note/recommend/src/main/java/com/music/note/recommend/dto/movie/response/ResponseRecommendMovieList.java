package com.music.note.recommend.dto.movie.response;

import java.util.ArrayList;
import java.util.List;

import com.music.note.recommend.dto.movie.RecommendMovieDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResponseRecommendMovieList {
	private List<RecommendMovieDto> movies = new ArrayList<>(); ;
	private int listSize;

	public void allocateListSize(){
		this.listSize = movies.size();
	}
}
