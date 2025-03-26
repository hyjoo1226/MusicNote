package com.music.note.kafkaeventmodel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicDto {
	private String spotifyId;
	private String title;
	private String artist;
}
