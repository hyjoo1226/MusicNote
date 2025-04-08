package com.music.note.musictype.consumer.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.musictype.consumer.dto.weekly.WeeklyReportResponse;
import com.music.note.musictype.consumer.service.WeeklyReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WeeklyReportController {
	private final WeeklyReportService weeklyReportService;

	@GetMapping("/weekly-report")
	public CommonResponse<List<WeeklyReportResponse>> processWeeklyReport(@RequestHeader("X-User-Id") String userId,
		@RequestParam int year,
		@RequestParam int month) {
		List<WeeklyReportResponse> reports = weeklyReportService.getMonthlyWeeklyReports(userId, year, month);
		return CommonResponse.success(reports);
	}
}