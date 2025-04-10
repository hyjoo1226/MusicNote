package com.music.note.recommend.service.type;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundByUserIdException;
import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundException;
import com.music.note.recommend.dto.home.ResponseHomeDto;
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
		// LocalDate start = LocalDate.of(year, month, 1);
		// LocalDate end = start.plusMonths(1);
		LocalDate end = LocalDate.of(year, month, 1);
		LocalDate start = end.plusMonths(1);

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

		LocalDateTime startOfDay = date.minusDays(6).atStartOfDay();
		LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

		Date start = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
		Date end = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());


		List<PersonalityReport> reportList = reportRepository.findByUserIdAndCreatedAtBetween(userId,
			start, end);
		List<TrendTypeDto> trendTypeDtoList = new ArrayList<>();
		Map<LocalDate, TrendTypeDto> dateToTrendMap = new HashMap<>();
		for (PersonalityReport report : reportList){
			TrendTypeDto trendTypeDto = reportMapper.entityToTrendTypeDto(report);
			LocalDate reportDate = trendTypeDto.getCreatedAt().toLocalDate();
			dateToTrendMap.put(reportDate, trendTypeDto);
		}
		for (int i = 0; i < 7; i++) {
			LocalDate currentDate = date.minusDays(6 - i);

			if (dateToTrendMap.containsKey(currentDate)) {
				trendTypeDtoList.add(dateToTrendMap.get(currentDate));
			}
			else {
				TrendTypeDto emptyDto = TrendTypeDto.builder()
					.createdAt(currentDate.atStartOfDay())
					.build();
				trendTypeDtoList.add(emptyDto);
			}
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

	public ResponseHomeDto readHomeData(String userId){
		PersonalityReport report = recommendCommonService.getLatestReportByUserId(userId);
		TypeDto typeDto = reportMapper.entityToTypeDto(report);
		String msg = getTodayMsg(typeDto);
		return reportMapper.reportToHomeDto(report, msg);

	}
	public String getTodayMsg(TypeDto typeDto) {
		Map<String, Double> traits = new HashMap<>();
		traits.put("openness", typeDto.getOpenness());
		traits.put("conscientiousness", typeDto.getConscientiousness());
		traits.put("extraversion", typeDto.getExtraversion());
		traits.put("agreeableness", typeDto.getAgreeableness());
		traits.put("neuroticism", typeDto.getNeuroticism());

		// 최고 점수 특성 찾기
		String maxTrait = traits.entrySet().stream()
			.max(Map.Entry.comparingByValue())
			.map(Map.Entry::getKey)
			.orElse("");

		// 특성별 오늘의 한마디
		return switch (maxTrait) {
			case "openness" -> "오늘은 개방성이 높으시네요. 새로운 아이디어나 창의적인 활동에 도전해보는 건 어떨까요?";
			case "conscientiousness" -> "오늘은 성실성이 높으시네요. 계획을 세우고 성취감을 느껴보세요!";
			case "extraversion" -> "오늘은 외향성이 높으시네요. 사람들과 어울리면서 많은 에너지를 얻는 건 어떨까요?";
			case "agreeableness" -> "오늘은 친화성이 높으시네요. 주변 사람들과 따뜻한 시간을 보내보세요.";
			case "neuroticism" -> "오늘은 신경성이 높으시네요. 잠시 휴식을 취하며 감정을 다독여보는 것도 좋아요.";
			default -> "당신만의 특별한 성격을 발견해보세요!";
		};
	}
}
