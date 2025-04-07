package com.music.note.musiccrawler.consumer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.musiccrawler.consumer.dto.TrackDataResponse;
import com.music.note.musiccrawler.consumer.service.CrawlingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CrawlingController {

	private final CrawlingService crawlingService;

	@GetMapping("/track/{trackId}")
	public TrackDataResponse getTrackData(@PathVariable String trackId) {
		return crawlingService.fetchTrackDataForTest(trackId);
	}
}