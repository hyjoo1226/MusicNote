package com.music.note.main.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;
import com.music.note.kafkaeventmodel.type.RequestType;
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

		return CommonResponse.success("일간 리포트(자동) 요청 성공");
	}

	@PostMapping("/daily")
	public CommonResponse<String> dailyReport(
		@RequestHeader("X-User-Id") String userId,
		@RequestBody List<MusicDto> musicList) {
		preferencesService.publishManualPreferences(Long.parseLong(userId), musicList);
		return CommonResponse.success("일간 리포트(수동) 요청 성공");
	}

	// TODO : test 용도
	@GetMapping("/weekly")
	public CommonResponse<String> weeklyReport(@RequestHeader("X-User-Id") String userId) {
		WeeklyReportEvent event = WeeklyReportEvent.builder()
			.userId(Long.parseLong(userId))
			.year(2025)
			.month(4)
			.day(5)
			.type(RequestType.WEEKLY)
			.build();
		requestEventProducer.testWeeklyEvent(event);
		return CommonResponse.success("주간 리포트 테스트 요청 성공");
	}
}
