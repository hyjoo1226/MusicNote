package com.music.note.recommend.dto.music.response;

import java.util.ArrayList;
import java.util.List;

import com.music.note.recommend.dto.music.RecommendMusicDto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseRecommendMusicList {
	private List<RecommendMusicDto> musics = new ArrayList<>(); ;
	private int listSize;

	public void allocateListSize(){
		this.listSize = musics.size();
	}
}
