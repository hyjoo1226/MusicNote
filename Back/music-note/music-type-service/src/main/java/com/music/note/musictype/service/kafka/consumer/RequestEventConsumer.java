package com.music.note.musictype.service.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.musictype.service.service.TrackService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestEventConsumer {

	private final TrackService trackService;

	@KafkaListener(topics = "music-request", groupId = "music-request-group")
	public void consumeRequestEvent(RequestEvent event) {
		log.info("[Consuming Request Event] -> userId={}, musicListSize={}",
			event.getUserId(), event.getMusicList().size());
		trackService.handleTrackCheck(event);
	}
}
