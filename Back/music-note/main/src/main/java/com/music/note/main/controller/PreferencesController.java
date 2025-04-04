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
	public CommonResponse<String> preferences(@RequestHeader("Spotify-Access-Token") String spotifyAccessToken) {

		// TODO: auth 서버 연동 후 userId 파라미터로 전달
		preferencesService.publishUserMusicPreferences(1L, spotifyAccessToken);
		return CommonResponse.success("음악 타입 결과 요청 성공");
	}
}
