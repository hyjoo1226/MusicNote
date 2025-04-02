package com.music.note.recommend.jwt.filter;

import static jakarta.ws.rs.core.HttpHeaders.*;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.music.note.jwt.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenFilter extends OncePerRequestFilter {
	@Value("${jwt.secret}")
	private String secretKey;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		Optional<String> accessToken = getToken(request, AUTHORIZATION);
		log.info("시큐리티 필터 작동");
		log.info("accessToken: {}", accessToken);
		log.info("키입니다. {}", secretKey); // 수정된 부분

		JwtUtil.isTokenEmpty(accessToken);
		JwtUtil.isTokenValid(accessToken.get(), secretKey);
		log.info("유저 인증이 완료되었습니다!");
		String memberIdString = JwtUtil.extractMemberId(accessToken.get(), secretKey);
		Long memberId = Long.valueOf(memberIdString);

		Authentication auth = new UsernamePasswordAuthenticationToken(memberId, null, Collections.emptyList());
		SecurityContextHolder.getContext().setAuthentication(auth);
		filterChain.doFilter(request, response);

	}
	private Optional<String> getToken(HttpServletRequest request, String headerName){
		String authorizationHeader = request.getHeader(headerName);

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
			return Optional.ofNullable(authorizationHeader.split(" ")[1]);
		}else {
			return Optional.empty();
		}
	}
}
