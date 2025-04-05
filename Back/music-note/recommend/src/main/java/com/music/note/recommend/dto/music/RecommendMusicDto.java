package com.music.note.recommend.dto.music;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RecommendMusicDto {

	@Setter
	private String id;

	@JsonProperty("track_name")
	private String trackName;

	@JsonProperty("artist_name")
	private String artistName;

	@JsonProperty("albumcover_path")
	private String albumCoverPath;

	@JsonProperty("release_date")
	private String releaseDate;

	private int popularity;
}
