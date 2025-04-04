// package com.music.note.recommend.config;
//
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
// import com.music.note.jwt.util.JwtUtil;
// import com.music.note.recommend.jwt.filter.JwtTokenFilter;
//
// import lombok.RequiredArgsConstructor;
//
// @EnableWebSecurity
// @Configuration
// @RequiredArgsConstructor
// public class SecurityConfig {
//
// 	private final JwtTokenFilter jwtTokenFilter;
// 	@Bean
// 	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
// 		httpSecurity
// 			.sessionManagement((session) -> session
// 				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
// 		httpSecurity
// 			.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
// 		httpSecurity
// 			.csrf(csrf -> csrf.disable());
// 		httpSecurity
// 			.headers(headers -> headers.disable());
// 		httpSecurity
// 			.formLogin((auth -> auth.disable()));
// 		httpSecurity.authorizeHttpRequests(auth -> auth
// 			.requestMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**").permitAll()
// 			.requestMatchers("/api/recommend/test").permitAll()
// 			.requestMatchers("/test").permitAll()
// 			.requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**").permitAll()
// 			.anyRequest().authenticated());
//
//
// 		return httpSecurity.build();
// 	}
// }