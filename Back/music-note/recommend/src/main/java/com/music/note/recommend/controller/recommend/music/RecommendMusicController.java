package com.music.note.recommend.controller.recommend.music;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.common.response.CommonResponse;
import com.music.note.recommend.dto.music.response.ResponseRecommendMusicList;
import com.music.note.recommend.service.domain.music.RecommendMusicService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMusicController {

	private final RecommendMusicService recommendMusicService;

	@PostMapping("/music")
	public CommonResponse<ResponseRecommendMusicList> recommendMusic(@RequestParam String memberId) {
		ResponseRecommendMusicList responseRecommendMusicList = recommendMusicService.recommendMusic(memberId);
		return CommonResponse.success(responseRecommendMusicList);
	}
}
