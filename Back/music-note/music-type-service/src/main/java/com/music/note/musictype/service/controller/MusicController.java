package com.music.note.musictype.service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class MusicController {
	// test api
	@GetMapping("/test")
	public String test(){
		return "테스트 호출 - MusicTypeService 서버";
	}

	// 음악 정보 조회

}
