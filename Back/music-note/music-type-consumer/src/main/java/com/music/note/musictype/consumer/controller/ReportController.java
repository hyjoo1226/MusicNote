package com.music.note.musictype.consumer.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.musictype.consumer.dto.daily.ManualReportResponse;
import com.music.note.musictype.consumer.dto.weekly.WeeklyReportResponse;
import com.music.note.musictype.consumer.service.DailyReportService;
import com.music.note.musictype.consumer.service.WeeklyReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReportController {
	private final WeeklyReportService weeklyReportService;
	private final DailyReportService dailyReportService;

	@GetMapping("/weekly-report")
	public CommonResponse<List<WeeklyReportResponse>> processWeeklyReport(@RequestHeader("X-User-Id") String userId,
		@RequestParam int year,
		@RequestParam int month) {
		List<WeeklyReportResponse> reports = weeklyReportService.getMonthlyWeeklyReports(userId, year, month);
		return CommonResponse.success(reports);
	}

	@GetMapping("/weekly-report/{reportId}")
	public CommonResponse<WeeklyReportResponse> getWeeklyReportById(
		@PathVariable String reportId) {
		return CommonResponse.success(weeklyReportService.getReportById(reportId));
	}

	@GetMapping("/daily-report")
	public CommonResponse<List<ManualReportResponse>> getReportsByUserId(
		@RequestHeader("X-User-Id") String userId) {
		return CommonResponse.success(dailyReportService.getReportsByUserId(userId));
	}

	@GetMapping("/daily-report/{reportId}")
	public CommonResponse<ManualReportResponse> getReportById(
		@PathVariable String reportId) {
		return CommonResponse.success(dailyReportService.getReportById(reportId));
	}
}