package com.music.note.common.exception.exception.common;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
	RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "4000", "요청하신 리소스를 찾을 수 없습니다."),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "4001", "잘못된 HTTP 메서드를 호출했습니다."),
	INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "4002", "올바르지 않은 입력값입니다."),
	NOT_FOUND(HttpStatus.NOT_FOUND, "4003", "존재하지 않는 엔티티입니다."),
	INVALID_TOKEN(HttpStatus.BAD_REQUEST, "4004", "토큰이 유효하지 않습니다."),
	EXPIRED_TOKEN(HttpStatus.BAD_REQUEST, "4005", "토큰이 만료됐습니다."),
	NULL_REQUIRED_VALUE(HttpStatus.BAD_REQUEST, "4006", "필수 요청값이 비어있습니다."),
	TOKEN_PARSING_ERROR(HttpStatus.BAD_REQUEST, "4007", "토큰 파싱 오류입니다."),
	JWT_INVALID_SIGNATURE(HttpStatus.BAD_REQUEST, "4008", "JWT 시그니처 불일치오류입니다."),
	JWT_EXPIRED_ERROR(HttpStatus.BAD_REQUEST, "4008", "JWT가 만료되었습니다."),
	JWT_UNSUPPORTED_ERROR(HttpStatus.BAD_REQUEST, "4009", "지원되지 않는 JWT 토큰입니다."),
	JWT_ILLEGAL_ERROR(HttpStatus.BAD_REQUEST, "4010", "JWT 형식이 적절하지 않습니다."),
	JWT_EMPTY_ERROR(HttpStatus.BAD_REQUEST, "4011", "JWT 토큰이 비어있습니다."),

	NOT_ENOUGH_MUSIC(HttpStatus.BAD_REQUEST, "4008", "분석 할 음악이 부족합니다."),
	SPOTIFY_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "4009", "Spotify 토큰이 만료되었거나 유효하지 않습니다."),

	NO_AUTHORITY(HttpStatus.BAD_REQUEST, "4013", "권한이 없습니다."),
	NOT_FOUND_PERSONALITY_REPORT(HttpStatus.NOT_FOUND, "4014", "성향 분석 엔티티를 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_MOVIE(HttpStatus.NOT_FOUND, "4015", "추천 영화를 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_MOVIE_LIKES(HttpStatus.NOT_FOUND, "4016", "좋아요한 추천 영화를 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_BOOK(HttpStatus.NOT_FOUND, "4017", "추천 책을 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_BOOK_LIKES(HttpStatus.NOT_FOUND, "4018", "좋아요한 추천 책을 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_MUSIC(HttpStatus.NOT_FOUND, "4019", "추천 음악을 조회할 수 없습니다."),
	NOT_FOUND_RECOMMEND_MUSIC_LIKES(HttpStatus.NOT_FOUND, "4019", "좋아요한 추천 음악을 조회할 수 없습니다."),

	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "5001", "서버 에러가 발생했습니다."),
	EXTERNAL_API_INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "5002", "외부 API 서버에서 오류가 발생했습니다."),

	INTERNAL_LOGIN_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "5003", "소셜 로그인 에러가 발생했습니다."),
	;
	private final HttpStatus status;
	private final String message;
	private final String code;

	ErrorCode(final HttpStatus status, final String code, final String message) {
		this.status = status;
		this.code = code;
		this.message = message;
	}
}