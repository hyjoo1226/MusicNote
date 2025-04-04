package com.music.note.recommend.dto.type;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendTypeDto {
	private double openness;
	private double conscientiousness;
	private double extraVersion;
	private double agreeableness;
	private double neuroticism;
	private LocalDateTime createdAt;
}
