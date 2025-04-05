package com.music.note.recommend.controller.like.music;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.jwt.util.JwtUtil;
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.dto.music.response.ResponseRecommendMusicList;
import com.music.note.recommend.service.like.music.RecommendMusicLikeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMusicLikeController {
	@Value("${jwt.secret}")
	private String secretKey;
	private final RecommendMusicLikeService recommendMusicLikeService;
	@PostMapping("/like/music")
	public CommonResponse<String> likeRecommendMusic(
		HttpServletRequest request,
		@RequestParam String recommendMusicId) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMusicLikeService.likeRecommendMusic(userId, recommendMusicId);
		return CommonResponse.success("ok");
	}
	@GetMapping("/like/music")
	public CommonResponse<ResponseRecommendMusicList> readLikeRecommendMusics(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMusicList responseRecommendMusicList = recommendMusicLikeService.readLikeRecommendMusic(userId);
		return CommonResponse.success(responseRecommendMusicList);
	}
	@DeleteMapping("like/music")
	public CommonResponse<String> CancelLikeRecommendMovies(
		HttpServletRequest request,
		@RequestParam String recommendMusicId) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMusicLikeService.cancelRecommendMusicLike(userId, recommendMusicId);
		return CommonResponse.success("ok");
	}


}
