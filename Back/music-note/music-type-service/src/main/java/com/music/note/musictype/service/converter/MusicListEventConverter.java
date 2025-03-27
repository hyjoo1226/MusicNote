package com.music.note.musictype.service.converter;

import java.util.List;
import java.util.stream.Collectors;

import com.music.note.kafkaeventmodel.dto.AudioFeaturesDto;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.trackdomain.domain.AudioFeatures;
import com.music.note.trackdomain.domain.Track;

public class MusicListEventConverter {

	public static MusicListEvent toEvent(Long userId, List<Track> tracks) {
		List<MusicDto> musicList = tracks.stream()
			.map(track -> MusicDto.builder()
				.spotifyId(track.getSpotifyId())
				.title(track.getTitle())
				.artist(track.getArtist())
				.audioFeatures(convertAudioFeatures(track.getAudioFeatures()))
				.build())
			.collect(Collectors.toList());

		return MusicListEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.build();
	}

	public static MusicListWithMissingEvent convertToCrawlEvent(Long userId, List<Track> tracks,
		List<MusicDto> missingTracks) {
		List<MusicDto> musicList = tracks.stream()
			.map(track -> MusicDto.builder()
				.spotifyId(track.getSpotifyId())
				.title(track.getTitle())
				.artist(track.getArtist())
				.audioFeatures(convertAudioFeatures(track.getAudioFeatures()))
				.build())
			.collect(Collectors.toList());

		return MusicListWithMissingEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.missingTracks(missingTracks)
			.build();
	}

	private static AudioFeaturesDto convertAudioFeatures(AudioFeatures features) {
		if (features == null)
			return null;

		return AudioFeaturesDto.builder()
			.tempo(features.getTempo())
			.acousticness(features.getAcousticness())
			.danceability(features.getDanceability())
			.energy(features.getEnergy())
			.instrumentalness(features.getInstrumentalness())
			.liveness(features.getLiveness())
			.loudness(features.getLoudness())
			.speechiness(features.getSpeechiness())
			.valence(features.getValence())
			.build();
	}
}
