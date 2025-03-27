package com.music.note.musictype.service.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.musictype.service.converter.EventConverter;
import com.music.note.musictype.service.kafka.producer.CrawlingEventProducer;
import com.music.note.musictype.service.kafka.producer.TypeEventProducer;
import com.music.note.musictype.service.repository.TrackRepository;
import com.music.note.musictype.service.types.TrackFilterType;
import com.music.note.trackdomain.domain.Track;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrackService {
	private final TrackRepository trackRepository;
	private final TypeEventProducer typeEventProducer;
	private final CrawlingEventProducer crawlingEventProducer;

	public void handleTrackCheck(RequestEvent event) {
		List<MusicDto> musicList = event.getMusicList();

		List<MusicDto> existingTracks = filterTracksByExistence(musicList, TrackFilterType.EXISTING);
		List<MusicDto> missingTracks = filterTracksByExistence(musicList, TrackFilterType.MISSING);

		List<Track> tracks = findTracksBySpotifyIds(musicList);

		// DB에 전부 존재하는 경우 -> 성향 분석 Event 생생
		if (missingTracks.isEmpty()) {
			// AudioFeatures 가져와 넣어줌
			MusicListEvent musicEvent = EventConverter.toMusicEvent(event.getUserId(), tracks);
			typeEventProducer.sendMusicListEvent(musicEvent);
		}
		// DB에 없는 음악이 있는 경우 -> 크롤링 Event 생성
		else {
			// AudioFeatures 가져와 넣어줌 (DB에 없는 음악은 null 로)
			MusicListWithMissingEvent crawlEvent = EventConverter.toCrawlEvent(
				event.getUserId(), tracks, existingTracks, missingTracks);
			crawlingEventProducer.sendCrawlingEvent(crawlEvent);
		}
	}

	private List<Track> findTracksBySpotifyIds(List<MusicDto> musicList) {
		return musicList.stream()
			.map(MusicDto::getSpotifyId)
			.map(trackRepository::findBySpotifyId)
			.filter(Objects::nonNull) // 혹시 못 찾은 트랙이 있는 경우 제외
			.toList();
	}

	public List<MusicDto> filterTracksByExistence(List<MusicDto> musicList, TrackFilterType filterType) {
		Set<String> foundTitles = trackRepository.findByTitleIn(
				musicList.stream()
					.map(MusicDto::getTitle)
					.toList()
			).stream()
			.map(Track::getTitle)
			.collect(Collectors.toSet());

		return musicList.stream()
			.filter(music -> {
				boolean exists = foundTitles.contains(music.getTitle());
				return switch (filterType) {
					case EXISTING -> exists;
					case MISSING -> !exists;
				};
			})
			.toList();
	}
}
