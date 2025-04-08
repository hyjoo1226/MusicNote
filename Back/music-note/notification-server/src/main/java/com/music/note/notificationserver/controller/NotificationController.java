package com.music.note.notificationserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.music.note.notificationserver.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationService;

	@GetMapping("/sse/subscribe")
	public SseEmitter subscribe(@RequestHeader("X-User-Id") String userId) {
		// TODO: Token 에서 userId 추출
		return notificationService.subscribe(Long.parseLong(userId));
	}
}
