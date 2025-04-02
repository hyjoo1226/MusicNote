// package com.music.note.recommend.jwt.service;
//
// import static com.music.note.common.exception.exception.common.ErrorCode.*;
//
// import java.util.Optional;
//
// import org.springframework.stereotype.Service;
//
// import org.springframework.beans.factory.annotation.Value;
//
// import com.music.note.common.exception.exception.domain.jwt.JwtTokenException;
//
// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.ExpiredJwtException;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.MalformedJwtException;
// import io.jsonwebtoken.UnsupportedJwtException;
// import lombok.extern.slf4j.Slf4j;
//
// @Slf4j
// @Service
// public class JwtService {
//
// 	@Value("${jwt.secret-key}")
// 	private String key;
//
// 	public void isTokenEmpty(Optional<String> token){
// 		if (token.isEmpty()){
// 			log.warn("jwt token이 비어있습니다.");
// 			throw new JwtTokenException(JWT_EMPTY_ERROR);
// 		}
//
// 	}
// 	public void isTokenValid(String token) {
// 		try {
// 			Jwts.parser().setSigningKey(key).parseClaimsJws(token);
// 		} catch (SecurityException | MalformedJwtException e) {
// 			log.warn("잘못된 JWT 서명입니다.");
// 			throw new JwtTokenException(JWT_INVALID_SIGNATURE); // 커스터마이징 예외 던지기
// 		} catch (ExpiredJwtException e) {
// 			log.warn("만료된 JWT 토큰입니다.");
// 			throw new JwtTokenException(JWT_EXPIRED_ERROR); // 커스터마이징 예외 던지기
// 		} catch (UnsupportedJwtException e) {
// 			log.warn("지원되지 않는 JWT 토큰입니다.");
// 			throw new JwtTokenException(JWT_UNSUPPORTED_ERROR); // 커스터마이징 예외 던지기
// 		} catch (IllegalArgumentException e) {
// 			log.warn("JWT 토큰이 잘못되었습니다.");
// 			throw new JwtTokenException(JWT_ILLEGAL_ERROR); // 커스터마이징 예외 던지기
// 		}
// 	}
//
//
// 	public String extractMemberId(String token){
// 		return extractClaims(token).get("id").toString();
// 	}
//
// 	private Claims extractClaims(String token){
// 		return Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody();
// 	}
//
// }