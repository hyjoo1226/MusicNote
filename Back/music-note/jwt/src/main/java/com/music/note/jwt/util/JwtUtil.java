package com.music.note.jwt.util;
import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.Optional;

import com.music.note.common.exception.exception.domain.jwt.JwtTokenException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class JwtUtil {
	public static void isTokenEmpty(Optional<String> token){
		if (token.isEmpty()){
			log.warn("jwt token이 비어있습니다.");
			throw new JwtTokenException(JWT_EMPTY_ERROR);
		}
		log.info("토큰 비어있나?{} ",token.get());
	}
	public static void isTokenValid(String token, String secretKey) {
		try {
			Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
		} catch (SecurityException | MalformedJwtException e) {
			log.warn("잘못된 JWT 서명입니다.");
			throw new JwtTokenException(JWT_INVALID_SIGNATURE);
		} catch (ExpiredJwtException e) {
			log.warn("만료된 JWT 토큰입니다.");
			throw new JwtTokenException(JWT_EXPIRED_ERROR);
		} catch (UnsupportedJwtException e) {
			log.warn("지원되지 않는 JWT 토큰입니다.");
			throw new JwtTokenException(JWT_UNSUPPORTED_ERROR);
		} catch (IllegalArgumentException e) {
			log.warn("JWT 토큰이 잘못되었습니다,", token);
			System.out.println(token +"입니다.");;
			throw new JwtTokenException(JWT_ILLEGAL_ERROR);
		}
	}

	public static String extractMemberId(String token,  String secretKey){
		return extractClaims(token, secretKey).get("id").toString();
	}
	public static String extractMemberEmail(String token,  String secretKey){
		return extractClaims(token, secretKey).get("email").toString();
	}

	private static Claims extractClaims(String token, String secretKey){
		return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
	}

}
