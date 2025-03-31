package com.music.note.musiccrawler.consumer.converter;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.musiccrawler.consumer.dto.TrackDataResponse;
import com.music.note.trackdomain.domain.AudioFeatures;
import com.music.note.trackdomain.domain.Track;

public class TrackConverter {
	public static Track toTrack(MusicDto musicDto, TrackDataResponse trackDataResponse) {
		return Track.builder()
			.spotifyId(musicDto.getSpotifyId())
			.title(musicDto.getTitle())
			.artist(musicDto.getArtist())
			.audioFeatures(toAudioFeatures(trackDataResponse))
			.build();
	}

	private static AudioFeatures toAudioFeatures(TrackDataResponse response) {
		return AudioFeatures.builder()
			.tempo(response.getTempo())
			.loudness(response.getLoudness())
			.acousticness(response.getAcousticness())
			.danceability(response.getDanceability())
			.energy(response.getEnergy())
			.instrumentalness(response.getInstrumentalness())
			.liveness(response.getLiveness())
			.speechiness(response.getSpeechiness())
			.valence(response.getValence())
			.build();
	}
}
