package com.music.note.kafkaeventmodel.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MusicListEvent {
	private Long userId;
	private List<MusicDto> musicList;
}
