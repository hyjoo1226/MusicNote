package com.music.note.musictype.consumer.kafka.proiducer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.NotificationEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {
	private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;

	public void sendMusicListEvent(NotificationEvent event) {
		kafkaTemplate.send("notification", event);
	}
}
