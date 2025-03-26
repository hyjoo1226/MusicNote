package com.music.note.kafkaeventmodel.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicListWithMissingEvent {
	private Long userId;
	private List<MusicDto> musicList;
	private List<MusicDto> missingTracks;
}
