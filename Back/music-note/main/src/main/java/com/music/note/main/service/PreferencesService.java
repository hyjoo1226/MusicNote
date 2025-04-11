package com.music.note.main.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.music.NotEnoughMusicException;
import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.RequestEvent;
import com.music.note.kafkaeventmodel.type.RequestType;
import com.music.note.main.kafka.producer.RequestEventProducer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferencesService {
	private final RequestEventProducer requestEventProducer;
	private final SpotifyService spotifyService;

	public void publishManualPreferences(Long userId, List<MusicDto> musicList) {
		if (musicList.isEmpty()) {
			throw new NotEnoughMusicException(ErrorCode.NOT_ENOUGH_MUSIC);
		}
		sendRequestEvent(userId, musicList, RequestType.MANUAL);
	}

	public void publishUserMusicPreferences(Long userId, String spotifyAccessToken) {
		// 스포티파이 API 를 통해 음악 리스트 조회
		List<MusicDto> musicList = spotifyService.fetchRecentTracks(spotifyAccessToken);
		if (musicList.isEmpty()) {
			throw new NotEnoughMusicException(ErrorCode.NOT_ENOUGH_MUSIC);
		}
		sendRequestEvent(userId, musicList, RequestType.AUTOMATIC);
	}

	// request event 전송
	private void sendRequestEvent(Long userId, List<MusicDto> musicList, RequestType type) {
		RequestEvent event = RequestEvent.builder()
			.userId(userId)
			.musicList(musicList)
			.type(type)
			.build();
		requestEventProducer.sendRequestEvent(event);
	}

}
