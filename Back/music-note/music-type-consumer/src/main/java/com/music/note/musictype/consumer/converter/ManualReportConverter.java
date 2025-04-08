package com.music.note.musictype.consumer.converter;

import java.util.List;

import com.music.note.kafkaeventmodel.dto.MusicDto;
import com.music.note.kafkaeventmodel.dto.MusicListEvent;
import com.music.note.musictype.consumer.dto.daily.PersonalityReportDto;
import com.music.note.typedomain.domain.ManualReport;

public class ManualReportConverter {
	public static ManualReport toEntity(MusicListEvent event, PersonalityReportDto dto) {
		return ManualReport.builder()
			.userId(event.getUserId().toString())
			.openness(dto.getOpenness())
			.conscientiousness(dto.getConscientiousness())
			.extraversion(dto.getExtraversion())
			.agreeableness(dto.getAgreeableness())
			.neuroticism(dto.getNeuroticism())
			.report(toReport(dto.getReport()))
			.musicList(toMusicDataList(event.getMusicList()))
			.build();
	}

	private static ManualReport.Report toReport(PersonalityReportDto.Report dto) {
		return ManualReport.Report.builder()
			.topScore(dto.getTopScore())
			.topText(dto.getTopText())
			.lowScore(dto.getLowScore())
			.lowText(dto.getLowText())
			.summary(dto.getSummary())
			.build();
	}

	private static List<ManualReport.MusicData> toMusicDataList(List<MusicDto> musicList) {
		return musicList.stream()
			.map(music -> ManualReport.MusicData.builder()
				.spotifyId(music.getSpotifyId())
				.title(music.getTitle())
				.artist(music.getArtist())
				.imageUrl(music.getImageUrl())
				.build())
			.toList();
	}
}
