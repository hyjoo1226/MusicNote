package com.music.note.recommend.controller.like.book;

import static com.music.note.recommend.constant.log.like.LikeConstantAction.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.common.logging.dto.LogEvent;
import com.music.note.recommend.common.logging.service.LoggingService;
import com.music.note.recommend.constant.log.like.LikeConstantAction;
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.dto.like.book.request.RequestRecommendBookLikeDto;
import com.music.note.recommend.dto.like.movie.request.RequestRecommendMovieLikeDto;
import com.music.note.recommend.service.like.book.RecommendBookLikeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendBookLikeController {
	private final RecommendBookLikeService recommendBookLikeService;
	@Value("${jwt.secret}")
	private String secretKey;
	private final LoggingService loggingService;
	@PostMapping("/like/book")
	public CommonResponse<String> likeRecommendMovies(
		HttpServletRequest request,
		@RequestBody RequestRecommendBookLikeDto recommendBookLikeDto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_BOOK_CREATE));

		recommendBookLikeService.likeRecommendBook(userId, recommendBookLikeDto);
		return CommonResponse.success("ok");
	}
	@GetMapping("/like/book")
	public CommonResponse<ResponseRecommendBookList> readLikeRecommendMovies(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_BOOK_READ));

		ResponseRecommendBookList responseRecommendBookList = recommendBookLikeService.readLikeRecommendBook(userId);
		return CommonResponse.success(responseRecommendBookList);
	}
	@DeleteMapping("like/book")
	public CommonResponse<String> deleteRecommendBookLike(
		HttpServletRequest request,
		@RequestBody RequestRecommendBookLikeDto recommendBookLikeDto){
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_BOOK_DELETE));

		recommendBookLikeService.deleteRecommendBookLike(recommendBookLikeDto, userId);
		return CommonResponse.success("ok");

	}



}
