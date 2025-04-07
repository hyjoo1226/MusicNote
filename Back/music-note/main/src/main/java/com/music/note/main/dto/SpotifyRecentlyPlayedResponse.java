package com.music.note.main.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpotifyRecentlyPlayedResponse {
	private List<SpotifyItem> items;

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class SpotifyItem {
		private SpotifyTrack track;
		private String played_at;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class SpotifyTrack {
		private String id;
		private String name;
		private List<SpotifyArtist> artists;
		private SpotifyAlbum album;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class SpotifyArtist {
		private String name;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class SpotifyAlbum {
		private List<SpotifyImage> images;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class SpotifyImage {
		private String url;
	}
}