package com.music.note.musiccrawler.consumer.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.musiccrawler.consumer.service.CrawlingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CrawlingEventConsumer {

	private final CrawlingService crawlingService;

	@KafkaListener(topics = "music-crawl", groupId = "music-crawl-group")
	public void consumeCrawlingEvent(MusicListWithMissingEvent event) {
		log.info("[Consuming Crawling Event] -> userId={}, musicListSize={}, missingTracksSize={}",
			event.getUserId(), event.getExistingTracks().size(), event.getMissingTracks().size());
		crawlingService.handleMissingTrackEvent(event);
	}
}
