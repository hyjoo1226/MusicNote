package com.music.note.musictype.consumer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.musictype.consumer.converter.AudioFeatureConverter;
import com.music.note.musictype.consumer.converter.PersonalityReportConverter;
import com.music.note.musictype.consumer.domain.PersonalityReport;
import com.music.note.musictype.consumer.dto.AudioFeaturesRequest;
import com.music.note.musictype.consumer.dto.PersonalityReportDto;
import com.music.note.musictype.consumer.repository.ReportRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService {

	private final RestClient restClient;
	private final ReportRepository reportRepository;

	public void processTypeEvent(MusicListEvent event) {

		// event 에서 AudioFeature 추출 및 request 객체 생성
		AudioFeaturesRequest request = AudioFeaturesRequest.builder()
			.tracks(AudioFeatureConverter.toList(event))
			.build();

		// python 서버에서 BigFive 및 리포트 받기
		PersonalityReportDto result = restClient.post()
			.uri("/predict/daily")
			.body(request)
			.retrieve()
			.body(PersonalityReportDto.class);

		// DB에 저장
		if (result == null) {
			throw new RuntimeException("Failed to get report from python server");
		}
		PersonalityReport entity = PersonalityReportConverter.toEntity(event.getUserId(), result);
		reportRepository.save(entity);

		log.info("Report saved: {}", entity);

		// SSE 알림 전송

	}
}
