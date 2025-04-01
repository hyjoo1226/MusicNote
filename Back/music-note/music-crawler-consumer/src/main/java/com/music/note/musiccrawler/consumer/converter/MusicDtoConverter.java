package com.music.note.musiccrawler.consumer.converter;

import com.music.note.kafkaeventmodel.dto.AudioFeaturesDto;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.trackdomain.domain.AudioFeatures;

public class MusicDtoConverter {

	public static AudioFeaturesDto toAudioFeaturesDto(AudioFeatures audioFeatures) {
		if (audioFeatures == null)
			return null;

		return AudioFeaturesDto.builder()
			.tempo(audioFeatures.getTempo())
			.acousticness(audioFeatures.getAcousticness())
			.danceability(audioFeatures.getDanceability())
			.energy(audioFeatures.getEnergy())
			.instrumentalness(audioFeatures.getInstrumentalness())
			.liveness(audioFeatures.getLiveness())
			.loudness(audioFeatures.getLoudness())
			.speechiness(audioFeatures.getSpeechiness())
			.valence(audioFeatures.getValence())
			.build();
	}

	public static MusicDto updateMusicDtoWithAudioFeatures(MusicDto musicDto, AudioFeaturesDto audioFeaturesDto) {
		if (musicDto == null)
			return null;

		return MusicDto.builder()
			.spotifyId(musicDto.getSpotifyId())
			.title(musicDto.getTitle())
			.artist(musicDto.getArtist())
			.audioFeatures(audioFeaturesDto)
			.build();
	}
}