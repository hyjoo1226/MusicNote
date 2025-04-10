package com.music.note.musictype.consumer.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.BusinessBaseException;
import com.music.note.kafkaeventmodel.dto.NotificationEvent;
import com.music.note.kafkaeventmodel.dto.WeeklyReportEvent;
import com.music.note.musictype.consumer.converter.WeeklyReportConverter;
import com.music.note.musictype.consumer.dto.weekly.BigFiveDto;
import com.music.note.musictype.consumer.dto.weekly.WeeklyReportDto;
import com.music.note.musictype.consumer.dto.weekly.WeeklyReportResponse;
import com.music.note.musictype.consumer.kafka.proiducer.NotificationProducer;
import com.music.note.musictype.consumer.repository.ReportRepository;
import com.music.note.musictype.consumer.repository.WeeklyReportRepository;
import com.music.note.typedomain.domain.PersonalityReport;
import com.music.note.typedomain.domain.WeeklyReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklyReportService {
	private static final String FAILED_TO_GET_WEEKLY_REPORT = "주간 리포트 데이터가 없습니다";
	private static final String WEEKLY_REPORT_READY_MESSAGE = "주간 리포트 생성 완료";
	private static final String WEEKLY_REPORT_URL = "/data/api/generate/report/weekly";

	private final RestClient restClient;
	private final ReportRepository reportRepository;
	private final NotificationProducer notificationProducer;
	private final WeeklyReportRepository weeklyReportRepository;

	public WeeklyReportResponse getReportById(String reportId) {
		WeeklyReport weeklyReport = weeklyReportRepository.findById(reportId)
			.orElseThrow(() -> new BusinessBaseException(ErrorCode.NOT_FOUND_PERSONALITY_REPORT));
		return WeeklyReportResponse.fromEntity(weeklyReport);
	}

	public List<WeeklyReportResponse> getMonthlyWeeklyReports(String userId, int year, int month) {
		LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
		LocalDateTime end = start.withDayOfMonth(start.toLocalDate().lengthOfMonth())
			.with(LocalTime.MAX);

		return weeklyReportRepository.findByUserIdAndCreatedAtBetween(userId, start, end)
			.stream()
			.map(WeeklyReportResponse::fromEntity)
			.toList();
	}

	public void processWeeklyTypeEvent(WeeklyReportEvent event) {

		// 1. 해당 주의 일간 리포트 리스트 조회
		List<PersonalityReport> dailyReports = getDailyReports(event);

		//TODO: List 가 3보다 작으면 예외 처리

		// 2. python 서버에서 주간 리포트 받기
		List<BigFiveDto> bigFiveList = WeeklyReportConverter.toBigFiveDtoList(dailyReports);
		WeeklyReportDto result = restClient.post()
			.uri(WEEKLY_REPORT_URL)
			.body(bigFiveList)
			.retrieve()
			.body(WeeklyReportDto.class);

		if (result == null) {
			throw new RuntimeException(FAILED_TO_GET_WEEKLY_REPORT);
		}

		WeeklyReport weeklyReport = WeeklyReportConverter.toWeeklyReport(event.getUserId().toString(), result,
			dailyReports);

		weeklyReportRepository.save(weeklyReport);
		log.info("Weekly Report saved: {}", weeklyReport.getSummary());

		// Notification 서버로 이벤트 전송
		NotificationEvent notificationEvent = NotificationEvent.builder()
			.userId(event.getUserId())
			.message(weeklyReport.getId())
			.type(event.getType())
			.build();
		notificationProducer.sendMusicListEvent(notificationEvent);

	}

	private List<PersonalityReport> getDailyReports(WeeklyReportEvent event) {
		LocalDate targetDate = LocalDate.of(event.getYear(), event.getMonth(), event.getDay());

		// 해당 날짜가 속한 주의 토요일 구하기
		LocalDate saturday = targetDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));
		LocalDate sunday = saturday.minusDays(6);

		LocalDateTime start = sunday.atStartOfDay();
		LocalDateTime end = saturday.atTime(LocalTime.MAX);
		return reportRepository.findByUserIdAndCreatedAtBetween(event.getUserId().toString(), start, end);
	}
}
