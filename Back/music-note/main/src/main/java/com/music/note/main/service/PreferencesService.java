package com.music.note.main.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.main.kafka.producer.RequestEventProducer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferencesService {
	private final RequestEventProducer requestEventProducer;

	public void publishUserMusicPreferences(Long userId) {
		List<MusicDto> musicList = getMusicListFromSpotify(userId);
		sendRequestEvent(userId, musicList);
	}

	// 스포티파이 API 를 통해 음악 리스트 조회
	private List<MusicDto> getMusicListFromSpotify(Long userId) {
		//TODO: 스포티파이 API 호출 후 musicList 생성
		return List.of(
			MusicDto.builder()
				.spotifyId("id1")
				.title("music1")
				.artist("artist1")
				.build(),
			MusicDto.builder()
				.spotifyId("id2")
				.title("music2")
				.artist("artist2")
				.build(),
			MusicDto.builder()
				.spotifyId("id3")
				.title("music3")
				.artist("artist3")
				.build()
		);
	}

	// request event 전송
	private void sendRequestEvent(Long userId, List<MusicDto> musicList) {
		RequestEvent event = RequestEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.build();
		requestEventProducer.sendRequestEvent(event);
	}

}
