package com.music.note.recommend.controller.like.movie;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.recommend.dto.like.movie.request.RequestRecommendMovieLikeDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.service.like.movie.RecommendMovieLikeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMovieLikeController {

	private final RecommendMovieLikeService recommendMovieLikeService;
	@PostMapping("/like/movie")
	public CommonResponse<String> likeRecommendMovies(
		@RequestParam Long memberId,
		@RequestBody RequestRecommendMovieLikeDto dto) {

		recommendMovieLikeService.likeRecommendMovie(memberId, dto);
		return CommonResponse.success("ok");
	}
	@PostMapping("/like/movie/test")
	public CommonResponse<String> likeRecommendMoviesTest(
		@RequestParam Long memberId,
		@RequestBody RequestRecommendMovieLikeDto dto) {

		recommendMovieLikeService.likeRecommendMovie(memberId, dto);
		return CommonResponse.success("ok");
	}
	@GetMapping("/like/movie")
	public CommonResponse<ResponseRecommendMovieList> readLikeRecommendMovies(
		@RequestParam Long memberId) {
		log.info("들어오나요?:{}", memberId);
		ResponseRecommendMovieList responseRecommendMovieList = recommendMovieLikeService.readLikeRecommendMovie(memberId);
		return CommonResponse.success(responseRecommendMovieList);
	}


}
