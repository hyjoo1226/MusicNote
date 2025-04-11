package com.music.note.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class RequestLoginDto {
	private String code;
	@JsonProperty("isLocal")
	private boolean isLocal;
}
