package com.music.note.main.converter;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.main.dto.SpotifyRecentlyPlayedResponse;

public class SpotifyTrackConverter {

	public static List<MusicDto> convert(SpotifyRecentlyPlayedResponse response) {
		if (response == null || response.getItems() == null) {
			return Collections.emptyList();
		}

		return response.getItems().stream()
			.map(SpotifyTrackConverter::toMusicDto)
			.collect(Collectors.toList());
	}

	private static MusicDto toMusicDto(SpotifyRecentlyPlayedResponse.SpotifyItem item) {
		var track = item.getTrack();

		String trackId = track.getId();
		String trackName = track.getName();
		String artistNames = track.getArtists().stream()
			.map(SpotifyRecentlyPlayedResponse.SpotifyArtist::getName)
			.collect(Collectors.joining(", "));

		String imageUrl = Optional.ofNullable(track.getAlbum())
			.map(SpotifyRecentlyPlayedResponse.SpotifyAlbum::getImages)
			.filter(images -> !images.isEmpty())
			.map(images -> images.get(0).getUrl())
			.orElse(null);

		return MusicDto.builder()
			.spotifyId(trackId)
			.title(trackName)
			.artist(artistNames)
			.imageUrl(imageUrl)
			.build();
	}
}
