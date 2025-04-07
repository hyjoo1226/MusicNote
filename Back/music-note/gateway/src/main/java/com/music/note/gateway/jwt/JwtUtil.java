package com.music.note.gateway.jwt;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {

	//TODO: yml 파일에 secretKey 를 넣고 가져오도록 수정
	private String secretKey = "music-note-jwt-key";

	public void isTokenValid(String token) {
		try {
			Jwts.parser()
				.setSigningKey(secretKey)
				.parseClaimsJws(token);

			log.info("유효한 JWT 토큰입니다.");
		} catch (Exception e) {
			log.warn("JWT 검증 실패: {}", e.getMessage());
			throw new RuntimeException("유효하지 않은 JWT 토큰입니다.");
		}
	}

	// ✅ Claims 전체 추출
	public Claims extractClaims(String token) {
		return Jwts.parser()
			.setSigningKey(secretKey)
			.parseClaimsJws(token)
			.getBody();
	}

	// ✅ 사용자 ID 추출
	public String getUserId(String token) {
		Object id = extractClaims(token).get("id");
		return String.valueOf(id);
	}
}
