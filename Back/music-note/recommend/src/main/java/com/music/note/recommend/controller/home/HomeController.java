package com.music.note.recommend.controller.home;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.home.ResponseHomeDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.service.type.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class HomeController {
	@Value("${jwt.secret}")
	private String secretKey;
	private final ReportService reportService;
	@GetMapping("/home")
	public CommonResponse<ResponseHomeDto> readHomeData(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseHomeDto responseHomeDto = reportService.readHomeData(userId);
		return CommonResponse.success(responseHomeDto);
	}

}
