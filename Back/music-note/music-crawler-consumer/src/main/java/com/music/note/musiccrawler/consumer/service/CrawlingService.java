package com.music.note.musiccrawler.consumer.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.note.kafkaeventmodel.dto.AudioFeaturesDto;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.musiccrawler.consumer.converter.TrackConverter;
import com.music.note.musiccrawler.consumer.dto.RawTrackDataResponse;
import com.music.note.musiccrawler.consumer.dto.TrackDataResponse;
import com.music.note.musiccrawler.consumer.kafka.producer.TypeEventProducer;
import com.music.note.musiccrawler.consumer.repository.TrackRepository;
import com.music.note.trackdomain.domain.AudioFeatures;
import com.music.note.trackdomain.domain.Track;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CrawlingService {

	private static final String API_KEY = "468c4fc9bede188fb0c40c59bf04929e96906531";
	private static final String BASE_API_URL = "https://api.zenrows.com/v1/";
	private static final String TARGET_URL_TEMPLATE = "https://songdata.io/track/%s/";
	private static final String CSS_EXTRACTOR = "{\"scores\":\"dd\"}";

	private final TrackRepository trackRepository;
	private final TypeEventProducer typeEventProducer;
	private final RestClient restClient;
	private final ObjectMapper objectMapper;

	public void handleMissingTrackEvent(MusicListWithMissingEvent event) {
		//TODO: 크롤링 실패 시 처리하기
		List<MusicDto> savedMissingTracks = saveMissingTracks(event.getMissingTracks());
		publishRequestEvent(event, savedMissingTracks);
	}

	private void publishRequestEvent(MusicListWithMissingEvent event, List<MusicDto> savedMissingTracks) {
		// 기존 musicList와 새로 저장된 트랙 리스트를 합침
		List<MusicDto> combinedList = new ArrayList<>(event.getExistingTracks());
		combinedList.addAll(savedMissingTracks);

		// 새 이벤트 생성
		MusicListEvent requestEvent = MusicListEvent.builder()
			.userId(event.getUserId())
			.musicList(combinedList)
			.build();

		// Kafka 등으로 전송
		typeEventProducer.sendMusicListEvent(requestEvent);
	}

	public List<MusicDto> saveMissingTracks(List<MusicDto> missingTracks) {
		List<MusicDto> updatedMusicList = new ArrayList<>();
		for (MusicDto musicDto : missingTracks) {
			TrackDataResponse trackDataResponse = fetchTrackData(musicDto.getSpotifyId());
			Track track = TrackConverter.toTrack(musicDto, trackDataResponse);
			trackRepository.save(track);

			// 3. Track의 AudioFeatures를 DTO로 변환
			AudioFeatures audioFeatures = track.getAudioFeatures();
			AudioFeaturesDto audioFeaturesDto = AudioFeaturesDto.builder()
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

			// 4. MusicDto에 반영
			MusicDto updatedDto = MusicDto.builder()
				.spotifyId(musicDto.getSpotifyId())
				.title(musicDto.getTitle())
				.artist(musicDto.getArtist())
				.audioFeatures(audioFeaturesDto)
				.build();
			updatedMusicList.add(updatedDto);
		}
		return updatedMusicList;
	}

	private TrackDataResponse fetchTrackData(String trackId) {
		URI uri = buildApiUri(trackId);

		String responseBody = restClient.get()
			.uri(uri)
			.retrieve()
			.body(String.class);

		return parseTrackData(responseBody);
	}

	private URI buildApiUri(String trackId) {
		return UriComponentsBuilder.fromUriString(BASE_API_URL)
			.queryParam("apikey", API_KEY)
			.queryParam("url", String.format(TARGET_URL_TEMPLATE, trackId))
			.queryParam("css_extractor", CSS_EXTRACTOR)
			.build()
			.toUri();
	}

	private TrackDataResponse parseTrackData(String json) {
		try {
			RawTrackDataResponse rawResponse = objectMapper.readValue(json, RawTrackDataResponse.class);
			return rawResponse.toStructuredResponse();
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse track data JSON: " + e.getMessage(), e);
		}
	}

	// TODO: 테스트용 메서드 (삭제)
	public TrackDataResponse fetchTrackDataForTest(String trackId) {
		URI uri = buildApiUri(trackId);

		String responseBody = restClient.get()
			.uri(uri)
			.retrieve()
			.body(String.class);

		return parseTrackData(responseBody);
	}
}
