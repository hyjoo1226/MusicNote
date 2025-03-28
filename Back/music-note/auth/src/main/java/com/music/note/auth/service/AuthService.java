package com.music.note.auth.service;


import java.util.Base64;
import java.util.Optional;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.note.auth.domain.Member;
import com.music.note.auth.dto.SpotifyMemberDto;
import com.music.note.auth.jwt.dto.JwtTokenDto;
import com.music.note.auth.jwt.provider.JwtProvider;
import com.music.note.auth.mapper.MemberMapper;
import com.music.note.auth.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
	
	@Value("${spotify.client-id}")
	private String clientId;

	@Value("${spotify.client-secret}")
	private String clientSecret;

	@Value("${spotify.user-info-uri}")
	private String userInfoUri;

	private final ObjectMapper objectMapper;

	private final RestTemplate restTemplate;

	private final MemberRepository memberRepository;

	private final JwtProvider jwtProvider;

	private final MemberMapper memberMapper;
	// 클라이언트에서 받은 code로 액세스 토큰을 요청
	public JwtTokenDto getAccessToken(String code) throws JsonProcessingException {
		String tokenUri = "https://accounts.spotify.com/api/token";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.set("Authorization", "Basic " + encodeCredentials(clientId, clientSecret));

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("code", code);
		body.add("grant_type", "authorization_code");
		body.add("redirect_uri", "http://localhost:5173/callback");

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

		ResponseEntity<String> response = restTemplate.exchange(
			tokenUri,
			HttpMethod.POST,
			entity,
			String.class
		);

		log.info("Access Token 응답: {}", response.getBody());
		String accessToken = extractAccessToken(response.getBody());
		String userInfo = getUserInfo(accessToken);

		SpotifyMemberDto spotifyMemberDto = objectMapper.readValue(userInfo, SpotifyMemberDto.class);
		Optional<Member> optionalMember = memberRepository.findBySocialId(spotifyMemberDto.getSocialId());

		if (optionalMember.isPresent()){
			Member existingMember = optionalMember.get();
			return generateJwtByMember(existingMember);
		}
		else {
			Member newMember = memberMapper.dtoToEntity(spotifyMemberDto);
			Member savedMember = memberRepository.save(newMember);
			return generateJwtByMember(savedMember);
		}
	}

	private String encodeCredentials(String clientId, String clientSecret) {
		String credentials = clientId + ":" + clientSecret;
		return Base64.getEncoder().encodeToString(credentials.getBytes());
	}

	private String extractAccessToken(String responseBody) throws JsonProcessingException {
		JsonNode jsonNode = objectMapper.readTree(responseBody);
		return jsonNode.get("access_token").asText();
	}

	public String getUserInfo(String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + accessToken);
		HttpEntity<String> entity = new HttpEntity<>(headers);

		ResponseEntity<String> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity, String.class);
		log.info("User Info: {}", response.getBody());
		return response.getBody();
	}
	private JwtTokenDto generateJwtByMember(Member member){
		return jwtProvider.generateAccessTokenAndRefreshToken(member.getName(),
			member.getEmail(), member.getMemberId());
	}
}
