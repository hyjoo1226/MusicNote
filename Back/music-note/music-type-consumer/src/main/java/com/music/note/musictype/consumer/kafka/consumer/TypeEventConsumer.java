package com.music.note.musictype.consumer.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;
import com.music.note.musictype.consumer.service.ReportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TypeEventConsumer {

	private final ReportService reportService;

	@KafkaListener(topics = "music-type", groupId = "music-type-group")
	public void consumeTypeEvent(MusicListEvent event) {
		reportService.processDailyTypeEvent(event);
	}

	@KafkaListener(topics = "weekly-type", groupId = "music-type-group")
	public void consumeWeeklyTypeEvent(WeeklyReportEvent event) {
		reportService.processWeeklyTypeEvent(event);
		log.info("Weekly Type Event consumed: {}", event);
	}
}
