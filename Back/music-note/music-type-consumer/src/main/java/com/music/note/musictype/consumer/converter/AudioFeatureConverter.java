package com.music.note.musictype.consumer.converter;

import java.util.List;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.musictype.consumer.dto.daily.AudioFeaturesDto;

public class AudioFeatureConverter {
	public static List<AudioFeaturesDto> toList(MusicListEvent event) {
		return event.getMusicList().stream()
			.map(music -> AudioFeaturesDto.builder()
				.tempo(music.getAudioFeatures().getTempo())
				.acousticness(music.getAudioFeatures().getAcousticness())
				.danceability(music.getAudioFeatures().getDanceability())
				.energy(music.getAudioFeatures().getEnergy())
				.instrumentalness(music.getAudioFeatures().getInstrumentalness())
				.liveness(music.getAudioFeatures().getLiveness())
				.loudness(music.getAudioFeatures().getLoudness())
				.speechiness(music.getAudioFeatures().getSpeechiness())
				.valence(music.getAudioFeatures().getValence())
				.build()
			)
			.toList();
	}
}
