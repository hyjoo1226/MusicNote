package com.music.note.notificationserver.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.NotificationEvent;
import com.music.note.notificationserver.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {

	private final NotificationService notificationService;

	@KafkaListener(topics = "notification", groupId = "notification-group")
	public void consumeTypeEvent(NotificationEvent event) {
		log.info(">>> 알림 잔송 <<<");
		log.info("userId: {}, msg: {}", event.getUserId(), event.getMessage());
		notificationService.sendNotification(event);
	}
}
