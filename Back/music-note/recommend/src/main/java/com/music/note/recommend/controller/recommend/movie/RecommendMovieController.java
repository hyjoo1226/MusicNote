package com.music.note.recommend.controller.recommend.movie;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.service.domain.movie.RecommendMovieService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMovieController {

	private final RecommendMovieService recommendMovieService;
	@Value("${jwt.secret}")
	private String secretKey;
	@GetMapping("/test")
	public String test() {
		log.info("로그 테스트!");
		return "테스트 호출 - 추천 서버";
	}

	@GetMapping("/test2")
	public Long test2(@RequestParam Long memberId){
		log.info("memberId: {}, Type: {}", memberId, memberId.getClass().getSimpleName());
		return memberId;
	}


	@PostMapping("/movie")
	public CommonResponse<ResponseRecommendMovieList> recommendMovies(HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMovieList responseMovieRecommendDto = recommendMovieService.recommendMovies(userId);
		return CommonResponse.success(responseMovieRecommendDto);
	}

	@GetMapping("/movie")
	public CommonResponse<ResponseRecommendMovieList> readRecommendMovies(HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMovieList responseMovieRecommendDto = recommendMovieService.readRecommendMovies(userId);
		return CommonResponse.success(responseMovieRecommendDto);
	}
}