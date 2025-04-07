package com.music.note.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RequestSpotifyAccessToken {
	private String refreshToken;
}
