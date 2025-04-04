package com.music.note.recommend.controller.recommend.book;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.service.domain.book.RecommendBookService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class
RecommendBookController {
	private final RecommendBookService recommendBookService;
	@Value("${jwt.secret}")
	private String secretKey;
	@PostMapping("/book")
	public CommonResponse<ResponseRecommendBookList> recommendMusic(HttpServletRequest request){
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendBookList responseMovieRecommendDto = recommendBookService.recommendBooks(userId);
		return CommonResponse.success(responseMovieRecommendDto);
	}
}
