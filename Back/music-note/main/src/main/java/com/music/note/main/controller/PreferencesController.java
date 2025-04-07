package com.music.note.main.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.main.service.PreferencesService;
import com.music.note.main.service.SpotifyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PreferencesController {

	private final PreferencesService preferencesService;
	private final SpotifyService spotifyService;

	@GetMapping("/preferences")
	public CommonResponse<String> preferences(
		@RequestHeader("Authorization") String accessToken,
		@RequestHeader("Spotify-Access-Token") String spotifyAccessToken,
		@RequestHeader("X-User-Id") String userId) {

		preferencesService.publishUserMusicPreferences(Long.parseLong(userId), spotifyAccessToken);

		return CommonResponse.success("음악 타입 결과 요청 성공");
	}
}
