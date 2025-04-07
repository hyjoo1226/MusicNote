package com.music.note.recommend.controller.recommend.music;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.music.response.ResponseRecommendMusicList;
import com.music.note.recommend.service.domain.music.RecommendMusicService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMusicController {

	private final RecommendMusicService recommendMusicService;
	@Value("${jwt.secret}")
	private String secretKey;

	@PostMapping("/music")
	public CommonResponse<ResponseRecommendMusicList> createdRecommendMusic(HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMusicList responseRecommendMusicList = recommendMusicService.recommendMusic(userId);
		return CommonResponse.success(responseRecommendMusicList);
	}
	@GetMapping("/music")
	public CommonResponse<ResponseRecommendMusicList> readRecommendMusic(HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMusicList responseRecommendMusicList = recommendMusicService.readRecommendMusic(userId);
		return CommonResponse.success(responseRecommendMusicList);
	}
}
