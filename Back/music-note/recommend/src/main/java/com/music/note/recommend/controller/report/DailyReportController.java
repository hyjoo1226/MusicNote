package com.music.note.recommend.controller.report;

import static com.music.note.recommend.constant.log.like.LikeConstantAction.*;
import static com.music.note.recommend.constant.log.report.ReportConstantAction.*;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.common.logging.dto.LogEvent;
import com.music.note.recommend.common.logging.service.LoggingService;
import com.music.note.recommend.dto.report.ResponseReportDto;
import com.music.note.recommend.dto.report.ResponseReportList;
import com.music.note.recommend.dto.report.music.ResponseMusicDtoList;
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
	private final LoggingService loggingService;
	@GetMapping("/daily")
	public CommonResponse<ResponseReportList> readDailyReport(
		HttpServletRequest request,
		@RequestParam int year,
		@RequestParam int month) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseReportList responseReportList = reportService.getMonthlyDailyReports(userId, month, year);

		// 유저의 리토프 조회 행동 체크
		loggingService.log(LogEvent.userAction(userId, READ_REPORT_MONTHLY));

		return CommonResponse.success(responseReportList);
	}
	@GetMapping()
	public CommonResponse<ResponseReportDto> readDailyReport(
		@RequestParam String reportId,
		HttpServletRequest request) {
		ResponseReportDto reportDto = reportService.getDailyReport(reportId);
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);

		// 유저의 리토프 조회 행동 체크
		loggingService.log(LogEvent.userAction(userId, READ_REPORT_DAILY));

		return CommonResponse.success(reportDto);
	}
	@GetMapping("/trend")
	public CommonResponse<ResponseWeeklyTypeDto> readDailyReport(
		@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseWeeklyTypeDto responseWeeklyTypeDto = reportService.getTypeTrend(userId, date);

		// 유저의 리토프 조회 행동 체크
		loggingService.log(LogEvent.userAction(userId, READ_REPORT_TREND));

		return CommonResponse.success(responseWeeklyTypeDto);
	}
	@GetMapping("music")
	public CommonResponse<ResponseMusicDtoList> readMusicData(
		@RequestParam String reportId,
		HttpServletRequest request) {
		ResponseMusicDtoList musicDtoList = reportService.readMusicDataByReportId(reportId);
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);

		// 유저의 리토프 조회 행동 체크
		loggingService.log(LogEvent.userAction(userId, READ_REPORT_MUSIC));

		return CommonResponse.success(musicDtoList);
	}
}
