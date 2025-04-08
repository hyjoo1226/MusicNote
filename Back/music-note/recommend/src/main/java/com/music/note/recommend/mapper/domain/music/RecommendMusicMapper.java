package com.music.note.recommend.mapper.domain.music;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.music.note.recommend.domain.recommned.music.RecommendMusic;
import com.music.note.recommend.dto.music.RecommendMusicDto;

@Component
public class RecommendMusicMapper {
	public RecommendMusic dtoToEntity(RecommendMusicDto dto, String userId) {
		return RecommendMusic.builder()
			.trackName(dto.getTrackName())
			.albumCoverPath(dto.getAlbumCoverPath())
			.artistName(dto.getArtistName())
			.releaseDate(dto.getReleaseDate())
			.durationMs(dto.getDurationMs())
			.userId(userId)
			.createdAt(LocalDateTime.now())
			.build();
	}

	public RecommendMusicDto entityToRecommendMusicDto(RecommendMusic recommendMusic) {
		return RecommendMusicDto.builder()
			.id(recommendMusic.getId())
			.albumCoverPath(recommendMusic.getAlbumCoverPath())
			.trackName(recommendMusic.getTrackName())
			.artistName(recommendMusic.getArtistName())
			.durationMs(recommendMusic.getDurationMs())
			.releaseDate(recommendMusic.getReleaseDate())
			.build();
	}
}
