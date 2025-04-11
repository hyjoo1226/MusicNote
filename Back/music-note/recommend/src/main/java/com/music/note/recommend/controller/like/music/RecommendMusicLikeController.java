package com.music.note.recommend.controller.like.music;

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
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.dto.like.music.request.RequestRecommendMusicLikeDto;
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
	private final LoggingService loggingService;
	@PostMapping("/like/music")
	public CommonResponse<String> likeRecommendMusic(
		HttpServletRequest request,
		@RequestBody RequestRecommendMusicLikeDto requestRecommendMusicLikeDto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMusicLikeService.likeRecommendMusic(userId, requestRecommendMusicLikeDto);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MUSIC_CREATE));
		return CommonResponse.success("ok");
	}
	@GetMapping("/like/music")
	public CommonResponse<ResponseRecommendMusicList> readLikeRecommendMusics(
		HttpServletRequest request) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		ResponseRecommendMusicList responseRecommendMusicList = recommendMusicLikeService.readLikeRecommendMusic(userId);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MUSIC_READ));

		return CommonResponse.success(responseRecommendMusicList);
	}
	@DeleteMapping("like/music")
	public CommonResponse<String> CancelLikeRecommendMovies(
		HttpServletRequest request,
		@RequestBody RequestRecommendMusicLikeDto requestRecommendMusicLikeDto) {
		String userId = JwtUtil.getUserIdByJwtToken(request, secretKey);
		recommendMusicLikeService.cancelRecommendMusicLike(userId, requestRecommendMusicLikeDto);

		// 추천 컨텐츠 좋아요한 유저의 행동 체크
		loggingService.log(LogEvent.userAction(userId, LIKE_MUSIC_DELETE));

		return CommonResponse.success("ok");
	}


}
