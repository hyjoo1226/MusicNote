package com.music.note.auth.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSpotifyAccessToken {
	private String spotifyAccessToken;
	private String spotifyRefreshToken;
}
