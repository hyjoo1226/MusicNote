package com.music.note.recommend.dto.report;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseReportDto {

	private String topScore;
	private String topText;
	private String lowScore;
	private String lowText;
	private String summary;
}
