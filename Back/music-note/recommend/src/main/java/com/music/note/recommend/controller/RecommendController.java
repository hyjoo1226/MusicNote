package com.music.note.recommend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.recommend.dto.response.ResponseMovieRecommendDto;
import com.music.note.recommend.service.RecommendMovieService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendController {

	private final RecommendMovieService recommendMovieService;
	@GetMapping("/test")
	public String test() {
		return "테스트 호출 - 추천 서버";
	}

	@GetMapping("/test2")
	public Long test2(@AuthenticationPrincipal Long memberId){
		log.info("memberId: {}, Type: {}", memberId, memberId.getClass().getSimpleName());
		return memberId;
	}
	// @PostMapping("/movie")
	// public CommonResponse<ResponseMovieRecommendDto> recommendMovies(@AuthenticationPrincipal Long memberId) {
	// 	ResponseMovieRecommendDto responseMovieRecommendDto = recommendMovieService.recommendMovies(memberId);
	// 	return CommonResponse.success(responseMovieRecommendDto);
	// }

}