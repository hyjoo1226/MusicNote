package com.music.note.recommend.dto.movie.response;

import java.util.ArrayList;
import java.util.List;

import com.music.note.recommend.dto.movie.MovieRecommendDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseRecommendMovieList {
	private List<MovieRecommendDto> movies = new ArrayList<>(); ;
	private int listSize;

	public void allocateListSize(){
		this.listSize = movies.size();
	}
}
