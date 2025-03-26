package com.music.note.musictype.service.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.musictype.service.kafka.producer.CrawlingEventProducer;
import com.music.note.musictype.service.kafka.producer.TypeEventProducer;
import com.music.note.musictype.service.repository.TrackRepository;
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

	public List<MusicDto> findMissingTracks(List<MusicDto> musicList) {
		List<String> titles = musicList.stream()
			.map(MusicDto::getTitle)
			.toList();

		Set<String> foundTitles = trackRepository.findByTitleIn(titles).stream()
			.map(Track::getTitle)
			.collect(Collectors.toSet());

		return musicList.stream()
			.filter(music -> !foundTitles.contains(music.getTitle()))
			.toList();
	}

	public void handleTrackCheck(RequestEvent event) {
		List<MusicDto> musicList = event.getMusicList();
		List<MusicDto> missingTracks = findMissingTracks(musicList);
		if (missingTracks.isEmpty()) {
			// DB에 전부 존재하는 경우 - 성향 분석 Event 발생
			typeEventProducer.sendMusicListEvent(MusicListEvent.builder()
				.userId(event.getUserId())
				.musicList(musicList)
				.build());
		} else {
			// DB에 없는 음악이 있는 경우 - 음악 검색 Event 발생
			crawlingEventProducer.sendCrawlingEvent(MusicListWithMissingEvent.builder()
				.userId(event.getUserId())
				.musicList(musicList)
				.missingTracks(missingTracks)
				.build());
		}
	}
}
