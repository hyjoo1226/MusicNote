package com.music.note.kafkaeventmodel.dto;

import com.music.note.kafkaeventmodel.type.RequestType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
	private Long userId;
	private String message;
	private RequestType type;
}
