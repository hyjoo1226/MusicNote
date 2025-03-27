package com.music.note.musictype.consumer.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TypeEventConsumer {

	@KafkaListener(topics = "music-type", groupId = "music-type-group")
	public void consumeTypeEvent(MusicListEvent event) {

	}
}
