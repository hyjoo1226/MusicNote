package com.music.note.recommend.dto.home;

import java.util.List;

import com.music.note.recommend.dto.music.RecommendMusicDto;
import com.music.note.recommend.dto.report.ResponseReportDto;
import com.music.note.recommend.dto.report.music.MusicDto;
import com.music.note.recommend.dto.type.TypeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseHomeDto {
	private TypeDto typeDto;
	private String todayMessage;
	private List<MusicDto> musicDtoList;
}
