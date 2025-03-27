package com.music.note.musiccrawler.consumer.service;

import java.net.URI;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.musiccrawler.consumer.converter.TrackConverter;
import com.music.note.musiccrawler.consumer.dto.RawTrackDataResponse;
import com.music.note.musiccrawler.consumer.dto.TrackDataResponse;
import com.music.note.musiccrawler.consumer.kafka.producer.TypeEventProducer;
import com.music.note.musiccrawler.consumer.repository.TrackRepository;
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
		saveMissingTracks(event.getMissingTracks());
		log.info(" ==> Missing tracks saved: userId={}, missingTracksSize={}", event.getUserId(),
			event.getMissingTracks().size());
		publishRequestEvent(event);
	}

	private void publishRequestEvent(MusicListWithMissingEvent event) {
		RequestEvent requestEvent = RequestEvent.builder()
			.userId(event.getUserId())
			.musicList(event.getMusicList())
			.build();

		typeEventProducer.sendMusicListEvent(requestEvent);
	}

	public void saveMissingTracks(List<MusicDto> missingTracks) {
		for (MusicDto musicDto : missingTracks) {
			TrackDataResponse trackDataResponse = fetchTrackData(musicDto.getSpotifyId());
			Track track = TrackConverter.toTrack(musicDto, trackDataResponse);
			trackRepository.save(track);
		}
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
