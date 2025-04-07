package com.music.note.musictype.consumer.dto.weekly;

import java.time.LocalDateTime;
import java.util.List;

import com.music.note.typedomain.domain.WeeklyReport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class WeeklyReportResponse {
	private String id;
	private String userId;
	private LocalDateTime createdAt;
	private String summary;
	private String topGrowth;
	private String topDecline;
	private String topFluctuation;
	private WeeklyReport.Trend trends;
	private List<DetailDto> details;

	public static WeeklyReportResponse fromEntity(WeeklyReport entity) {
		return WeeklyReportResponse.builder()
			.id(entity.getId())
			.userId(entity.getUserId())
			.createdAt(entity.getCreatedAt())
			.summary(entity.getSummary())
			.topGrowth(entity.getTopGrowth())
			.topDecline(entity.getTopDecline())
			.topFluctuation(entity.getTopFluctuation())
			.trends(entity.getTrends())
			.details(entity.getDetails().stream()
				.map(DetailDto::fromEntity)
				.toList())
			.build();
	}
}
