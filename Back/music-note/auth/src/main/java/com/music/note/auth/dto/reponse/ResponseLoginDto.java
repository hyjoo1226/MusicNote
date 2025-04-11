package com.music.note.auth.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ResponseLoginDto {
	private String accessToken;
	private String spotify_refreshToken;
	private String spotify_accessToken;
	private boolean is_first_user;
}
