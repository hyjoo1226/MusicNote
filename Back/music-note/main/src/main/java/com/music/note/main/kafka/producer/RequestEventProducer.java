package com.music.note.main.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.RequestEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestEventProducer {
	private final KafkaTemplate<String, RequestEvent> kafkaTemplate;

	public void sendRequestEvent(RequestEvent event) {
		log.info("[Producing Request Event] -> userId={}, musicListSize={}",
			event.getUserId(), event.getMusicList().size());
		kafkaTemplate.send("music-request", event);
	}
}
