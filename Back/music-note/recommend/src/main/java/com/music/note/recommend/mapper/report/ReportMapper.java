package com.music.note.recommend.mapper.report;

import static com.music.note.typedomain.domain.PersonalityReport.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.music.note.recommend.dto.report.ResponseReportDto;
import com.music.note.recommend.dto.report.music.MusicDto;
import com.music.note.recommend.dto.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.dto.report.ResponseReportWithTypeDto;
import com.music.note.recommend.dto.type.TrendTypeDto;
import com.music.note.recommend.dto.type.TypeDto;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ReportMapper {
	public RequestLatestPersonalityReportDto entityToDto(PersonalityReport report) {
		return RequestLatestPersonalityReportDto.builder()
			.extraversion(report.getExtraversion())
			.agreeableness(report.getAgreeableness())
			.neuroticism(report.getNeuroticism())
			.conscientiousness(report.getConscientiousness())
			.openness(report.getOpenness())
			.build();
	}
	public TypeDto entityToTypeDto(PersonalityReport report) {
		return TypeDto.builder()
			.extraVersion(report.getExtraversion())
			.agreeableness(report.getAgreeableness())
			.neuroticism(report.getNeuroticism())
			.conscientiousness(report.getConscientiousness())
			.openness(report.getOpenness())
			.build();
	}

	public ResponseReportWithTypeDto entityToResponseReport(PersonalityReport report){
		TypeDto typeDto = entityToTypeDto(report);
		return ResponseReportWithTypeDto.builder()
			.reportId(report.getId())
			.createdAt(report.getCreatedAt())
			.typeDto(typeDto)
			.build();
	}

	public ResponseReportDto entityToResponseReportDto(PersonalityReport reqReport) {
		TypeDto typeDto = entityToTypeDto(reqReport);
		Report report = reqReport.getReport();
		return ResponseReportDto.builder()
			.id(reqReport.getId())
			.lowText(report.getLowText())
			.summary(report.getSummary())
			.topScore(report.getTopScore())
			.topText(report.getTopText())
			.lowScore(report.getLowScore())
			.typeDto(typeDto)
			.build();
	}

	public TrendTypeDto entityToTrendTypeDto(PersonalityReport report) {
		return TrendTypeDto.builder()
			.extraVersion(report.getExtraversion())
			.agreeableness(report.getAgreeableness())
			.neuroticism(report.getNeuroticism())
			.conscientiousness(report.getConscientiousness())
			.openness(report.getOpenness())
			.createdAt(report.getCreatedAt())
			.build();

	}
	public List<MusicDto> reportToMusicDto(PersonalityReport report){
		List<MusicDto> list = new ArrayList<>();
		List<MusicData> musicList = report.getMusicList();
		for (MusicData musicData: musicList){
			MusicDto musicDto = MusicDto.builder()
				.title(musicData.getTitle())
				.artist(musicData.getArtist())
				.imageUrl(musicData.getImageUrl())
				.spotifyId(musicData.getSpotifyId())
				.build();
			list.add(musicDto);
		}
		return list;
	}
}
