package com.music.note.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.auth.jwt.dto.JwtTokenDto;
import com.music.note.auth.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	@GetMapping("/test")
	public String test(){
		return "테스트 호출 - 인증 서버";
	}
	@GetMapping("/test2")
	public String test2(){
		return "테스트 호출 - 인증 서버2";
	}
	@PostMapping("/login")
	public String login(@RequestParam String code) {
		try {
			log.info("로그인 시도");
			JwtTokenDto jwtTokenDto = authService.getAccessToken(code);
			return jwtTokenDto.getAccessToken();

		} catch (Exception e) {
			log.error("로그인 실패: ", e);
			return "fail";
		}
	}

}
