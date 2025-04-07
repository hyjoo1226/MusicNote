package com.music.note.recommend.service.type;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundByUserIdException;
import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundException;
import com.music.note.recommend.dto.report.ResponseReportDto;
import com.music.note.recommend.dto.report.ResponseReportWithTypeDto;
import com.music.note.recommend.dto.report.ResponseReportList;
import com.music.note.recommend.dto.report.music.MusicDto;
import com.music.note.recommend.dto.report.music.ResponseMusicDtoList;
import com.music.note.recommend.dto.type.ResponseWeeklyTypeDto;
import com.music.note.recommend.dto.type.TrendTypeDto;
import com.music.note.recommend.dto.type.TypeDto;
import com.music.note.recommend.mapper.report.ReportMapper;
import com.music.note.recommend.repository.personality.ReportRepository;
import com.music.note.recommend.service.common.RecommendCommonService;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService {

	private final ReportRepository reportRepository;
	private final ReportMapper reportMapper;
	private final RecommendCommonService recommendCommonService;
	public ResponseReportList getMonthlyDailyReports(String userId, int month, int year){
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = start.plusMonths(1);

		Date startDate = Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant());
		Date endDate = Date.from(end.atStartOfDay(ZoneId.systemDefault()).toInstant());

		List<PersonalityReport> reportList = reportRepository.findByUserIdAndCreatedAtBetween(userId,
			startDate, endDate);
		List<ResponseReportWithTypeDto> responseReportList = new ArrayList<>();
		for (PersonalityReport report : reportList){
			ResponseReportWithTypeDto responseReport = reportMapper.entityToResponseReport(report);
			responseReportList.add(responseReport);
		}
		return ResponseReportList.builder()
			.responseTypeWithReportIds(responseReportList)
			.listSize(responseReportList.size())
			.build();

	}

	public ResponseReportDto getDailyReport(String reportId) {
		PersonalityReport report = reportRepository.findById(reportId)
			.orElseThrow(() -> new PersonalityNotFoundException(NOT_FOUND_PERSONALITY_REPORT));
		return reportMapper.entityToResponseReportDto(report);
	}

	public ResponseWeeklyTypeDto getTypeTrend(String userId, LocalDate date) {
		// 시작 날짜 00:00:00
		LocalDateTime startOfDay = date.atStartOfDay();
		// 끝 날짜 = 시작 + 7일
		LocalDateTime endOfDay = date.plusDays(7).atStartOfDay();

		// LocalDateTime → Date 변환
		Date start = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
		Date end = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
		List<PersonalityReport> reportList = reportRepository.findByUserIdAndCreatedAtBetween(userId,
			start, end);
		List<TrendTypeDto> trendTypeDtoList = new ArrayList<>();
		for (PersonalityReport report : reportList){
			TrendTypeDto trendTypeDto = reportMapper.entityToTrendTypeDto(report);
			trendTypeDtoList.add(trendTypeDto);
		}
		return ResponseWeeklyTypeDto.builder()
			.trendTypeDtoList(trendTypeDtoList)
			.listSize(trendTypeDtoList.size())
			.build();
	}

	public ResponseMusicDtoList readMusicDataByReportId(String reportId) {
		PersonalityReport report = reportRepository.findById(reportId)
			.orElseThrow(() -> new PersonalityNotFoundException(NOT_FOUND_PERSONALITY_REPORT));
		List<MusicDto> musicDtos = reportMapper.reportToMusicDto(report);
		return ResponseMusicDtoList.builder()
			.musicDtoList(musicDtos)
			.listSize(musicDtos.size())
			.build();
	}
}
