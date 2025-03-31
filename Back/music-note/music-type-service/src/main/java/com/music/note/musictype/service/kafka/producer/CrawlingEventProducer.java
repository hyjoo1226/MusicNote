package com.music.note.musictype.service.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CrawlingEventProducer {
	private final KafkaTemplate<String, MusicListWithMissingEvent> kafkaTemplate;

	public void sendCrawlingEvent(MusicListWithMissingEvent event) {
		log.info("[Producing Type Event] -> userId={}, musicListSize={}, missingTracks={}",
			event.getUserId(), event.getExistingTracks().size(), event.getMissingTracks().size());
		kafkaTemplate.send("music-crawl", event);
	}
}
