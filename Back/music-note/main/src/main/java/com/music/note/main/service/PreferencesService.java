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
				.spotifyId("3dI59jLoFMjMAyUAyRZnkE")
				.title("BANG BANG BANG")
				.artist("BIGBANG")
				.build(),
			MusicDto.builder()
				.spotifyId("1L4d2lafz1odpIMe8va21X")
				.title("Haru Haru")
				.artist("BIGBANG")
				.build(),
			MusicDto.builder()
				.spotifyId("4LOLvDtzykDC7y9WehFoOi")
				.title("Blue")
				.artist("BIGBANG")
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
