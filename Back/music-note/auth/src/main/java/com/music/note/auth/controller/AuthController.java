package com.music.note.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {
	@GetMapping("/test")
	public String test(){
		return "테스트 호출 - 인증 서버";
	}
}
