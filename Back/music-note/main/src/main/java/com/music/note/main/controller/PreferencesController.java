package com.music.note.main.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;
import com.music.note.main.kafka.producer.RequestEventProducer;
import com.music.note.main.service.PreferencesService;
import com.music.note.main.service.SpotifyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PreferencesController {

	private final PreferencesService preferencesService;
	private final SpotifyService spotifyService;
	private final RequestEventProducer requestEventProducer;

	@GetMapping("/preferences")
	public CommonResponse<String> preferences(
		@RequestHeader("Authorization") String accessToken,
		@RequestHeader("Spotify-Access-Token") String spotifyAccessToken,
		@RequestHeader("X-User-Id") String userId) {

		preferencesService.publishUserMusicPreferences(Long.parseLong(userId), spotifyAccessToken);

		return CommonResponse.success("음악 타입 결과 요청 성공");
	}

	// TODO : test 용도
	@GetMapping("/weekly")
	public CommonResponse<String> weeklyReport(@RequestHeader("X-User-Id") String userId) {
		WeeklyReportEvent event = WeeklyReportEvent.builder()
			.userId(Long.parseLong(userId))
			.year(2025)
			.month(4)
			.day(5)
			.build();
		requestEventProducer.testWeeklyEvent(event);
		return CommonResponse.success("주간 리포트 테스트 요청 성공");
	}
}
