package com.music.note.kafkaeventmodel.dto;

import java.util.List;

import com.music.note.kafkaeventmodel.type.RequestType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicListEvent {
	private Long userId;
	private List<MusicDto> musicList;
	private RequestType type;
}
