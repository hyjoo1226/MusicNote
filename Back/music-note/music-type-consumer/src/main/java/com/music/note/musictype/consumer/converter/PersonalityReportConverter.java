package com.music.note.musictype.consumer.converter;

import com.music.note.musictype.consumer.dto.PersonalityReportDto;
import com.music.note.typedomain.domain.PersonalityReport;

public class PersonalityReportConverter {
	public static PersonalityReport toEntity(Long userId, PersonalityReportDto dto) {
		return PersonalityReport.builder()
			.userId(userId.toString())
			.openness(dto.getOpenness())
			.conscientiousness(dto.getConscientiousness())
			.extraversion(dto.getExtraversion())
			.agreeableness(dto.getAgreeableness())
			.neuroticism(dto.getNeuroticism())
			.report(
				PersonalityReport.Report.builder()
					.topScore(dto.getReport().getTopScore())
					.topText(dto.getReport().getTopText())
					.lowScore(dto.getReport().getLowScore())
					.lowText(dto.getReport().getLowText())
					.summary(dto.getReport().getSummary())
					.build()
			)
			.build();
	}
}
