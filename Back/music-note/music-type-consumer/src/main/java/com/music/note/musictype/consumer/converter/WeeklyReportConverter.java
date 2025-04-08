package com.music.note.musictype.consumer.converter;

import java.time.LocalDateTime;
import java.util.List;

import com.music.note.musictype.consumer.dto.weekly.BigFiveDto;
import com.music.note.musictype.consumer.dto.weekly.WeeklyReportDto;
import com.music.note.typedomain.domain.PersonalityReport;
import com.music.note.typedomain.domain.WeeklyReport;

public class WeeklyReportConverter {
	public static WeeklyReport toWeeklyReport(String userId, WeeklyReportDto dto, List<PersonalityReport> reports) {
		return WeeklyReport.builder()
			.userId(userId)
			.createdAt(LocalDateTime.now())
			.trends(toTrend(dto.getTrends()))
			.summary(dto.getSummary())
			.topGrowth(dto.getTop_growth())
			.topDecline(dto.getTop_decline())
			.topFluctuation(dto.getTop_fluctuation())
			.details(toDetails(reports))
			.build();
	}

	public static WeeklyReport.Trend toTrend(WeeklyReportDto.Trends trends) {
		return WeeklyReport.Trend.builder()
			.openness(trends.getOpenness())
			.conscientiousness(trends.getConscientiousness())
			.extraversion(trends.getExtraversion())
			.agreeableness(trends.getAgreeableness())
			.neuroticism(trends.getNeuroticism())
			.build();
	}

	public static List<WeeklyReport.Detail> toDetails(List<PersonalityReport> reports) {
		return reports.stream()
			.map(r -> WeeklyReport.Detail.builder()
				.createdAt(r.getCreatedAt())
				.openness(r.getOpenness())
				.conscientiousness(r.getConscientiousness())
				.extraversion(r.getExtraversion())
				.agreeableness(r.getAgreeableness())
				.neuroticism(r.getNeuroticism())
				.build())
			.toList();
	}

	public static List<BigFiveDto> toBigFiveDtoList(List<PersonalityReport> reports) {
		return reports.stream()
			.map(report -> BigFiveDto.builder()
				.openness(report.getOpenness())
				.conscientiousness(report.getConscientiousness())
				.extraversion(report.getExtraversion())
				.agreeableness(report.getAgreeableness())
				.neuroticism(report.getNeuroticism())
				.build())
			.toList();
	}
}
