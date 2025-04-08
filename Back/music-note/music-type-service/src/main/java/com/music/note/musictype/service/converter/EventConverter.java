package com.music.note.musictype.service.converter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.music.note.kafkaeventmodel.dto.AudioFeaturesDto;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.kafkaeventmodel.type.RequestType;
import com.music.note.trackdomain.domain.AudioFeatures;
import com.music.note.trackdomain.domain.Track;

public class EventConverter {

	public static MusicListEvent toMusicEvent(Long userId, List<Track> tracks, RequestType type) {
		List<MusicDto> musicList = tracks.stream()
			.map(EventConverter::convertToDto)
			.collect(Collectors.toList());

		return MusicListEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.type(type)
			.build();
	}

	public static MusicListWithMissingEvent toCrawlEvent(
		Long userId,
		List<Track> tracks,
		List<MusicDto> existingTracks,
		List<MusicDto> missingTracks,
		RequestType type
	) {
		Map<String, Track> trackMap = tracks.stream()
			.collect(Collectors.toMap(Track::getSpotifyId, track -> track));

		List<MusicDto> completedExistingTracks = existingTracks.stream()
			.map(dto -> convertToDto(dto, trackMap.get(dto.getSpotifyId())))
			.collect(Collectors.toList());

		List<MusicDto> completedMissingTracks = missingTracks.stream()
			.map(dto -> convertToDto(dto, trackMap.get(dto.getSpotifyId())))
			.collect(Collectors.toList());

		return MusicListWithMissingEvent.builder()
			.userId(userId)
			.existingTracks(completedExistingTracks)
			.missingTracks(completedMissingTracks)
			.type(type)
			.build();
	}

	private static MusicDto convertToDto(Track track) {
		if (track == null)
			return null;

		return MusicDto.builder()
			.spotifyId(track.getSpotifyId())
			.title(track.getTitle())
			.artist(track.getArtist())
			.imageUrl(track.getImageUrl())
			.audioFeatures(convertAudioFeatures(track.getAudioFeatures()))
			.build();
	}

	private static MusicDto convertToDto(MusicDto dto, Track track) {
		if (track == null)
			return dto; // 예외 방지
		return MusicDto.builder()
			.spotifyId(dto.getSpotifyId())
			.title(dto.getTitle())
			.artist(dto.getArtist())
			.audioFeatures(convertAudioFeatures(track.getAudioFeatures()))
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
