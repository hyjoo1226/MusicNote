package com.music.note.musiccrawler.consumer.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.RequestEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TypeEventProducer {
	private final KafkaTemplate<String, RequestEvent> kafkaTemplate;

	public void sendMusicListEvent(RequestEvent event) {
		log.info("[Producing request Event from crawl server] -> userId={}, musicListSize={}",
			event.getUserId(), event.getMusicList().size());
		kafkaTemplate.send("music-request", event);
	}
}
