package com.music.note.musictype.service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PreferencesController {

	@GetMapping("/preferences")
	public String preferences() {
		return "음악 취향 정보 조회";
	}
}
