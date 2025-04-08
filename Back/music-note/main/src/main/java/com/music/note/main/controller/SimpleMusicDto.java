package com.music.note.main.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleMusicDto {
	private String spotifyId;
	private String title;
	private String artist;
	private String imageUrl;
}
