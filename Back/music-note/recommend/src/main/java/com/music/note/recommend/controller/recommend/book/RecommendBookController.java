package com.music.note.recommend.controller.recommend.book;



import static com.music.note.recommend.constant.log.recommned.RecommendConstantAction.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.common.logging.dto.LogEvent;
import com.music.note.recommend.common.logging.service.LoggingService;
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
	private final LoggingService loggingService;
	@PostMapping("/book")
	public CommonResponse<ResponseRecommendBookList> createRecommendMusic(HttpServletRequest request){
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendBookList responseMovieRecommendDto = recommendBookService.recommendBooks(userId);

		// 유저 액션 테스트
		loggingService.log(LogEvent.userAction(userId, RECOMMEND_BOOK));

		return CommonResponse.success(responseMovieRecommendDto);
	}
	@GetMapping("/book")
	public CommonResponse<ResponseRecommendBookList> readRecommendBook(HttpServletRequest request){
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendBookList responseMovieRecommendDto = recommendBookService.readRecommendBook(userId);

		// 유저 액션 테스트
		loggingService.log(LogEvent.userAction(userId, RECOMMEND_BOOK));

		return CommonResponse.success(responseMovieRecommendDto);
	}
}
