package com.music.note.musictype.service.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TypeEventProducer {
	private final KafkaTemplate<String, MusicListEvent> kafkaTemplate;

	public void sendMusicListEvent(MusicListEvent event) {
		log.info("[Producing Type Event] -> userId={}, musicListSize={}",
			event.getUserId(), event.getMusicList().size());
		kafkaTemplate.send("music-type", event);
	}
}
