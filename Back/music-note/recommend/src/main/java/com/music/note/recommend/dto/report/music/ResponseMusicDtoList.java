package com.music.note.recommend.dto.report.music;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMusicDtoList {
	private List<MusicDto> musicDtoList = new ArrayList<>();
	private int listSize;
}
