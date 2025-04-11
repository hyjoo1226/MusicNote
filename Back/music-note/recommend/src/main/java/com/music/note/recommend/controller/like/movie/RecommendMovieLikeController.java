package com.music.note.recommend.controller.like.movie;


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
import com.music.note.recommend.dto.like.movie.request.RequestRecommendMovieLikeDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.service.like.movie.RecommendMovieLikeService;

import io.jsonwebtoken.Jwt;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMovieLikeController {

	private final RecommendMovieLikeService recommendMovieLikeService;
	private final LoggingService loggingService;
	@Value("${jwt.secret}")
	private String secretKey;
	@PostMapping("/like/movie")
	public CommonResponse<String> likeRecommendMovies(
		HttpServletRequest request,
		@RequestBody RequestRecommendMovieLikeDto requestRecommendMovieLikeDto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMovieLikeService.likeRecommendMovie(userId, requestRecommendMovieLikeDto);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MOVIE_CREATE));


		return CommonResponse.success("ok");
	}
	@GetMapping("/like/movie")
	public CommonResponse<ResponseRecommendMovieList> readLikeRecommendMovies(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMovieList responseRecommendMovieList = recommendMovieLikeService.readLikeRecommendMovie(userId);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MOVIE_READ));

		return CommonResponse.success(responseRecommendMovieList);
	}

	@DeleteMapping("like/movie")
	public CommonResponse<String> CancelLikeRecommendMovies(
		HttpServletRequest request,
		@RequestBody RequestRecommendMovieLikeDto requestRecommendMovieLikeDto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMovieLikeService.cancelRecommendMovieLike(userId, requestRecommendMovieLikeDto);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MOVIE_DELETE));
		return CommonResponse.success("ok");
	}
}
