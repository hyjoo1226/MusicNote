package com.music.note.auth.service;


import static com.music.note.auth.constant.spotify.SpotifyConstant.*;
import static com.music.note.common.exception.exception.common.ErrorCode.*;
import static com.music.note.common.exception.exception.common.ErrorCode.EXTERNAL_API_INTERNAL_SERVER_ERROR;

import java.util.Base64;
import java.util.Optional;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.note.auth.domain.Member;
import com.music.note.auth.dto.login.SpotifyMemberDto;
import com.music.note.auth.dto.reponse.ResponseLoginDto;
import com.music.note.auth.dto.reponse.ResponseSpotifyAccessToken;
import com.music.note.auth.dto.request.RequestLoginDto;
import com.music.note.auth.jwt.dto.JwtTokenDto;
import com.music.note.auth.jwt.provider.JwtProvider;
import com.music.note.auth.mapper.MemberMapper;
import com.music.note.auth.repository.MemberRepository;
import com.music.note.common.exception.exception.domain.auth.ExternalApiException;
import com.music.note.common.exception.exception.domain.auth.SocialLoginException;
import com.music.note.common.exception.exception.domain.auth.TokenParsingException;

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

	@Value("${spotify.redirect-url}")
	private String redirectUrl;

	@Value("${spotify.local-redirect-url}")
	private String localRedirectUrl;

	private final ObjectMapper objectMapper;

	private final RestTemplate restTemplate;

	private final MemberRepository memberRepository;

	private final JwtProvider jwtProvider;

	private final MemberMapper memberMapper;

	public ResponseLoginDto login(RequestLoginDto reqLoginDto){
		log.info("Received code: {}", reqLoginDto.getCode());

		try {

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
			headers.set("Authorization", "Basic " + encodeCredentials(clientId, clientSecret));

			MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
			body.add("code", reqLoginDto.getCode());
			body.add("grant_type", "authorization_code");
			if (reqLoginDto.isLocal()){
				body.add("redirect_uri", localRedirectUrl);
			}
			else {
				body.add("redirect_uri", redirectUrl);
			}

			HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

			ResponseEntity<String> response = restTemplate.exchange(
				tokenUri,
				HttpMethod.POST,
				entity,
				String.class
			);

			log.info("Access Token 응답: {}", response.getBody());

			log.info("response status ={}",response);

			if (response.getStatusCode() != HttpStatus.OK) {
				throw new ExternalApiException(EXTERNAL_API_INTERNAL_SERVER_ERROR);
			}

			String spotifyAccessToken = extractAccessToken(response.getBody());
			String spotifyRefreshToken = extractRefreshToken(response.getBody());
			String userInfo = getUserInfo(spotifyAccessToken);

			SpotifyMemberDto spotifyMemberDto = objectMapper.readValue(userInfo, SpotifyMemberDto.class);
			Optional<Member> optionalMember = memberRepository.findBySocialId(spotifyMemberDto.getSocialId());

			if (optionalMember.isPresent()) {
				Member existingMember = optionalMember.get();
				JwtTokenDto jwtTokenDto = generateJwtByMember(existingMember);
				return ResponseLoginDto.builder()
					.is_first_user(false)
					.accessToken(jwtTokenDto.getAccessToken())
					.spotify_accessToken(spotifyAccessToken)
					.spotify_refreshToken(spotifyRefreshToken)
					.build();
			} else {
				Member newMember = memberMapper.dtoToEntity(spotifyMemberDto);
				Member savedMember = memberRepository.save(newMember);
				JwtTokenDto jwtTokenDto = generateJwtByMember(savedMember);
				return ResponseLoginDto.builder()
					.is_first_user(true)
					.accessToken(jwtTokenDto.getAccessToken())
					.spotify_accessToken(spotifyAccessToken)
					.spotify_refreshToken(spotifyRefreshToken)
					.build();
			}
		} catch (JsonProcessingException e) {
			log.error("JSON 처리 중 오류 발생", e);
			throw new TokenParsingException(TOKEN_PARSING_ERROR);
		} catch (RestClientException e) {
			log.error("외부 API 호출 중 오류 발생", e);
			throw new ExternalApiException(EXTERNAL_API_INTERNAL_SERVER_ERROR);
		} catch (Exception e) {
			log.error("소셜 로그인 처리 중 예상치 못한 오류 발생", e);
			throw new SocialLoginException(INTERNAL_LOGIN_ERROR);
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

	private String extractRefreshToken(String responseBody) throws JsonProcessingException {
		JsonNode jsonNode = objectMapper.readTree(responseBody);
		return jsonNode.get("refresh_token").asText();
	}

	private String getUserInfo(String accessToken) {
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

	public ResponseSpotifyAccessToken getSpotifyAccessTokenByRefreshToken(String refreshToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.set("Authorization", "Basic " + encodeCredentials(clientId, clientSecret));

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("grant_type", "refresh_token");
		body.add("refresh_token", refreshToken);
		body.add("client_id", clientId);

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

		ResponseEntity<String> response = restTemplate.exchange(
			tokenUri,
			HttpMethod.POST,
			entity,
			String.class
		);
		if (response.getStatusCode() != HttpStatus.OK) {
			throw new ExternalApiException(EXTERNAL_API_INTERNAL_SERVER_ERROR);
		}
		String spotifyAccessToken;
		log.info("Access Token response by Refresh Token: {}", response.getBody());
		try {
			spotifyAccessToken = extractAccessToken(response.getBody());
		} catch (JsonProcessingException e) {
			log.error("JSON 처리 중 오류 발생", e);
			throw new TokenParsingException(TOKEN_PARSING_ERROR);
		}
		return ResponseSpotifyAccessToken.builder()
			.spotifyAccessToken(spotifyAccessToken)
			.build();
	}
}
