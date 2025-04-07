package com.music.note.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponse<T> {
	private int status;
	private String message;
	private T data;

	// ✅ 성공 응답
	public static <T> CommonResponse<T> success(T data) {
		return new CommonResponse<>(200, "success", data);
	}

	public static <T> CommonResponse<T> success(String message, T data) {
		return new CommonResponse<>(200, message, data);
	}
}