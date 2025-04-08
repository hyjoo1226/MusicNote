package com.music.note.gateway.filter;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.music.note.gateway.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthorizationHeaderFilter implements GlobalFilter, Ordered {

	private static final List<String> EXCLUDE_URL_PATTERNS = List.of(
		"/api/auth/login",
		"/api/auth/signup",
		"/api/recommend/test",
		"/api/auth/test"
	);

	private final JwtUtil jwtUtil;

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		ServerHttpRequest request = exchange.getRequest();
		String path = request.getURI().getPath();

		// 인증이 필요 없는 경로는 통과
		if (path.endsWith("/actuator/health") ||
			EXCLUDE_URL_PATTERNS.stream().anyMatch(path::contains)) {
			return chain.filter(exchange);
		}

		// Authorization 헤더 추출
		String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return onError(exchange, "Authorization header is missing or invalid");
		}

		String token = authHeader.substring(7); // "Bearer " 제거

		try {
			//토큰 검증
			jwtUtil.isTokenValid(token);

			//사용자 ID를 추출해서 헤더에 추가
			String userId = jwtUtil.getUserId(token);

			ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
				.headers(headers -> headers.add("X-User-Id", userId))
				.build();

			return chain.filter(exchange.mutate().request(modifiedRequest).build());

		} catch (Exception e) {
			return onError(exchange, e.getMessage());
		}
	}

	private Mono<Void> onError(ServerWebExchange exchange, String errMsg) {
		log.error("Error: {}", errMsg);
		exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
		return exchange.getResponse().setComplete();
	}

	@Override
	public int getOrder() {
		return -1;
	}
}
