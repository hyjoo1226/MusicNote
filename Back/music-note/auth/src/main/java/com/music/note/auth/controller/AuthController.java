package com.music.note.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.music.note.auth.dto.reponse.ResponseLoginDto;
import com.music.note.auth.dto.reponse.ResponseSpotifyAccessToken;
import com.music.note.auth.dto.request.RequestLoginDto;
import com.music.note.auth.service.AuthService;
import com.music.note.common.response.CommonResponse;

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
	@PostMapping("/login")
	public CommonResponse<ResponseLoginDto> login(@RequestBody RequestLoginDto reqLoginDto) {
		log.info("로그인 시도");
		ResponseLoginDto responseLoginDto = authService.login(reqLoginDto);
		return CommonResponse.success(responseLoginDto);

	}

	@GetMapping("/spotify/refresh")
	public CommonResponse<ResponseSpotifyAccessToken> login(@RequestParam String refreshToken) {
		log.info("spotify access token reissue");
		ResponseSpotifyAccessToken responseSpotifyAccessToken = authService.getSpotifyAccessTokenByRefreshToken(refreshToken);
		return CommonResponse.success(responseSpotifyAccessToken);

	}

}
