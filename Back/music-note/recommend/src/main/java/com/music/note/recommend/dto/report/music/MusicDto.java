package com.music.note.recommend.dto.report.music;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MusicDto {
	private String spotifyId;
	private String title;
	private String artist;
	private String imageUrl;
}
