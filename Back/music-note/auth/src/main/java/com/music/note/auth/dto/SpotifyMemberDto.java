package com.music.note.auth.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpotifyMemberDto {
	private String email;

	@JsonProperty("id")
	private String socialId;

	@JsonProperty("display_name")
	private String name;
}
