package com.music.note.musictype.consumer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.NotificationEvent;
import com.music.note.musictype.consumer.converter.AudioFeatureConverter;
import com.music.note.musictype.consumer.converter.PersonalityReportConverter;
import com.music.note.musictype.consumer.dto.AudioFeaturesRequest;
import com.music.note.musictype.consumer.dto.PersonalityReportDto;
import com.music.note.musictype.consumer.kafka.proiducer.NotificationProducer;
import com.music.note.musictype.consumer.repository.ReportRepository;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService {

	private static final String FAILED_TO_GET_REPORT = "BigFive 데이터가 없습니다";
	private static final String DAILY_REPORT_READY_MESSAGE = "성향 리포트 생성 완료";
	private static final String DAILY_REPORT_URL = "/data/api/predict/bigfive/daily";

	private final RestClient restClient;
	private final ReportRepository reportRepository;
	private final NotificationProducer notificationProducer;

	public void processTypeEvent(MusicListEvent event) {

		// event 에서 AudioFeature 추출 및 request 객체 생성
		AudioFeaturesRequest request = AudioFeaturesRequest.builder()
			.tracks(AudioFeatureConverter.toList(event))
			.build();

		// python 서버에서 BigFive 및 리포트 받기
		PersonalityReportDto result = restClient.post()
			.uri(DAILY_REPORT_URL)
			.body(request)
			.retrieve()
			.body(PersonalityReportDto.class);

		// DB에 저장
		if (result == null) {
			throw new RuntimeException(FAILED_TO_GET_REPORT);
		}
		PersonalityReport entity = PersonalityReportConverter.toEntity(event, result);
		reportRepository.save(entity);

		log.info("Report saved: {}", entity.getReport().toString());

		// Notification 서버로 이벤트 전송
		NotificationEvent notificationEvent = NotificationEvent.builder()
			.userId(event.getUserId())
			.message(DAILY_REPORT_READY_MESSAGE)
			.build();
		notificationProducer.sendMusicListEvent(notificationEvent);

	}
}
