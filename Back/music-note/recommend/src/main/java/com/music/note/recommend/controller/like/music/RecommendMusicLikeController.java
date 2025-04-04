package com.music.note.recommend.controller.like.music;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class RecommendMusicLikeController {
	@Value("${jwt.secret}")
	private String secretKey;
}
