package com.music.note.main.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestEventProducer {
	private final KafkaTemplate<String, RequestEvent> kafkaTemplate;
	private final KafkaTemplate<String, WeeklyReportEvent> weeklyTemplate;

	public void sendRequestEvent(RequestEvent event) {
		log.info("[Producing Request Event] -> userId={}, musicListSize={}",
			event.getUserId(), event.getMusicList().size());
		kafkaTemplate.send("music-request", event);
	}

	public void testWeeklyEvent(WeeklyReportEvent event) {
		log.info("[Producing Weekly Report Event] -> userId={}, year={}, month={}, day={}",
			event.getUserId(), event.getYear(), event.getMonth(), event.getDay());
		weeklyTemplate.send("weekly-type", event);
	}
}
