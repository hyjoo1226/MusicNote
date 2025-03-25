package com.music.note.main.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.main.kafka.producer.RequestEventProducer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferencesService {
	private final RequestEventProducer requestEventProducer;

	public void publishUserMusicPreferences(Long userId) {
		List<String> musicList = getMusicListFromSpotify(userId);
		sendRequestEvent(userId, musicList);
	}

	// 스포티파이 API 를 통해 음악 리스트 조회
	private List<String> getMusicListFromSpotify(Long userId) {
		//TODO: 스포티파이 API 호출 후 musicList 생성
		return new ArrayList<>(List.of("music1", "music2", "music3"));
	}

	// request event 전송
	private void sendRequestEvent(Long userId, List<String> musicList) {
		RequestEvent event = RequestEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.build();
		requestEventProducer.sendRequestEvent(event);
	}

}
