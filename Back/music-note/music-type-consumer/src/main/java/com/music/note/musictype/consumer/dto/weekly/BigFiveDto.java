package com.music.note.musictype.consumer.dto.weekly;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BigFiveDto {
	private double openness;
	private double conscientiousness;
	private double extraversion;
	private double agreeableness;
	private double neuroticism;
}
