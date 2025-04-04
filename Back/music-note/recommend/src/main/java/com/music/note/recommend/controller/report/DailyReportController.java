package com.music.note.recommend.controller.report;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.report.ResponseReportDto;
import com.music.note.recommend.dto.report.ResponseReportList;
import com.music.note.recommend.dto.type.ResponseWeeklyTypeDto;
import com.music.note.recommend.service.type.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/type")
public class DailyReportController {
	@Value("${jwt.secret}")
	private String secretKey;

	private final ReportService reportService;
	@GetMapping("/daily")
	public CommonResponse<ResponseReportList> readDailyReport(
		HttpServletRequest request,
		@RequestParam int year,
		@RequestParam int month) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseReportList responseReportList = reportService.getMonthlyDailyReports(userId, month, year);
		return CommonResponse.success(responseReportList);
	}
	@GetMapping()
	public CommonResponse<ResponseReportDto> readDailyReport(
		@RequestParam String reportId) {
		ResponseReportDto reportDto = reportService.getDailyReport(reportId);
		return CommonResponse.success(reportDto);
	}
	@GetMapping("/trend")
	public CommonResponse<ResponseWeeklyTypeDto> readDailyReport(
		@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseWeeklyTypeDto responseWeeklyTypeDto = reportService.getTypeTrend(userId, date);
		return CommonResponse.success(responseWeeklyTypeDto);
	}
}
