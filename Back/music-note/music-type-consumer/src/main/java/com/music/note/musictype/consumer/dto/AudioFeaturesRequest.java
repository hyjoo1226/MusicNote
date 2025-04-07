package com.music.note.musictype.consumer.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AudioFeaturesRequest {
	@JsonProperty("tracks") // 이 부분이 핵심!
	private List<AudioFeaturesDto> tracks;
}
