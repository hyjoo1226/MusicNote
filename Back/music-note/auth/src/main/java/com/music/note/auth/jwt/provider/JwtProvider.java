package com.music.note.auth.jwt.provider;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.music.note.auth.jwt.dto.JwtTokenDto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtProvider {
	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private long jwtExpirationInMs;

	@Value("${jwt.refreshExpiration}")
	private long jwtRefreshExpirationInMs;

	public JwtTokenDto generateAccessTokenAndRefreshToken(String username, String email, Long id){
		String accessToken = generateAccessToken(username, email, id);
		String refreshToken = generateRefreshToken(username);
		return JwtTokenDto.builder()
			.accessToken(accessToken)
			.refreshToken(refreshToken)
			.build();
	}
	private String generateAccessToken(String username, String email, Long id) {
		return Jwts.builder()
			.setSubject(username)
			.claim("email", email)
			.claim("id", id)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
			.signWith(SignatureAlgorithm.HS512, jwtSecret)
			.compact();
	}
	private String generateRefreshToken(String username) {
		return Jwts.builder()
			.setSubject(username)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + jwtRefreshExpirationInMs))
			.signWith(SignatureAlgorithm.HS512, jwtSecret)
			.compact();
	}

}
