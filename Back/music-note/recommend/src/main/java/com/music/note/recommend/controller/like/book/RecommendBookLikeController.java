package com.music.note.recommend.controller.like.book;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
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
	@PostMapping("/like/book")
	public CommonResponse<String> likeRecommendMovies(
		HttpServletRequest request,
		@RequestBody RequestRecommendBookLikeDto dto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendBookLikeService.likeRecommendBook(userId, dto);
		return CommonResponse.success("ok");
	}
	@GetMapping("/like/book")
	public CommonResponse<ResponseRecommendBookList> readLikeRecommendMovies(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendBookList responseRecommendBookList = recommendBookLikeService.readLikeRecommendBook(userId);
		return CommonResponse.success(responseRecommendBookList);
	}


}
