package com.music.note.musictype.service.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.kafkaeventmodel.dto.MusicListWithMissingEvent;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.musictype.service.domain.Track;
import com.music.note.musictype.service.kafka.producer.CrawlingEventProducer;
import com.music.note.musictype.service.kafka.producer.TypeEventProducer;
import com.music.note.musictype.service.repository.TrackRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrackService {
	private final TrackRepository trackRepository;
	private final TypeEventProducer typeEventProducer;
	private final CrawlingEventProducer crawlingEventProducer;

	public List<String> findMissingTracks(List<String> musicList) {
		Set<String> foundTitles = trackRepository.findByTitleIn(musicList).stream()
			.map(Track::getTitle)
			.collect(Collectors.toSet());

		return musicList.stream()
			.filter(title -> !foundTitles.contains(title))
			.toList();
	}

	public void handleTrackCheck(RequestEvent event) {
		List<String> musicList = event.getMusicList();
		List<String> missingTracks = findMissingTracks(musicList);
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
