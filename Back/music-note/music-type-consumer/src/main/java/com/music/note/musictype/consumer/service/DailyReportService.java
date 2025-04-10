package com.music.note.musictype.consumer.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.NotificationEvent;
import com.music.note.kafkaeventmodel.type.RequestType;
import com.music.note.musictype.consumer.converter.AudioFeatureConverter;
import com.music.note.musictype.consumer.converter.ManualReportConverter;
import com.music.note.musictype.consumer.converter.PersonalityReportConverter;
import com.music.note.musictype.consumer.dto.daily.AudioFeaturesRequest;
import com.music.note.musictype.consumer.dto.daily.ManualReportResponse;
import com.music.note.musictype.consumer.dto.daily.PersonalityReportDto;
import com.music.note.musictype.consumer.kafka.proiducer.NotificationProducer;
import com.music.note.musictype.consumer.repository.ManualReportRepository;
import com.music.note.musictype.consumer.repository.ReportRepository;
import com.music.note.typedomain.domain.ManualReport;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class DailyReportService {

	private static final String FAILED_TO_GET_REPORT = "Python 서버에서 리포트를 가져오지 못했습니다";
	private static final String DAILY_REPORT_READY_MESSAGE = "일간 리포트 생성 완료";
	private static final String DAILY_REPORT_URL = "/data/api/predict/bigfive/daily";

	private final RestClient restClient;
	private final ReportRepository reportRepository;
	private final ManualReportRepository manualReportRepository;
	private final NotificationProducer notificationProducer;

	public List<ManualReportResponse> getReportsByUserId(String userId) {
		List<ManualReport> reports = manualReportRepository.findAllByUserId(userId);

		if (reports.isEmpty()) {
			throw new BusinessBaseException(ErrorCode.NOT_FOUND_PERSONALITY_REPORT);
		}

		return reports.stream()
			.map(ManualReportResponse::from)
			.toList();
	}

	public ManualReportResponse getReportById(String id) {
		ManualReport report = manualReportRepository.findById(id)
			.orElseThrow(() -> new BusinessBaseException(ErrorCode.NOT_FOUND_PERSONALITY_REPORT));
		return ManualReportResponse.from(report);
	}

	public void processDailyTypeEvent(MusicListEvent event) {

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
		String id = "";
		if (event.getType().equals(RequestType.AUTOMATIC)) {
			PersonalityReport entity = PersonalityReportConverter.toEntity(event, result);
			reportRepository.save(entity);
			id = entity.getId();
			log.info("AUTOMATIC Daily Report saved: {}", entity.getReport().toString());
		} else if (event.getType().equals(RequestType.MANUAL)) {
			ManualReport entity = ManualReportConverter.toEntity(event, result);
			manualReportRepository.save(entity);
			id = entity.getId();
			log.info("MANUAL Daily Report saved: {}", entity.getReport().toString());
		}

		// Notification 서버로 이벤트 전송
		NotificationEvent notificationEvent = NotificationEvent.builder()
			.userId(event.getUserId())
			.message(id)
			.type(event.getType())
			.build();
		notificationProducer.sendMusicListEvent(notificationEvent);
	}

}
