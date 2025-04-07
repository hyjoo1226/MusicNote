package com.music.note.musictype.consumer.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;
import com.music.note.musictype.consumer.service.DailyReportService;
import com.music.note.musictype.consumer.service.WeeklyReportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TypeEventConsumer {

	private final DailyReportService dailyReportService;
	private final WeeklyReportService weeklyReportService;

	@KafkaListener(topics = "music-type", groupId = "music-type-group")
	public void consumeTypeEvent(MusicListEvent event) {
		dailyReportService.processDailyTypeEvent(event);
	}

	@KafkaListener(topics = "weekly-type", groupId = "music-type-group")
	public void consumeWeeklyTypeEvent(WeeklyReportEvent event) {
		weeklyReportService.processWeeklyTypeEvent(event);
		log.info("Weekly Type Event consumed: {}", event);
	}
}
