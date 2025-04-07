package com.music.note.notificationserver.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.music.note.kafkaeventmodel.dto.NotificationEvent;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class NotificationService {
	private static final Long DEFAULT_TIMEOUT = 30 * 60 * 1000L; // 30분
	private final Map<Long, SseEmitter> emitterMap = new ConcurrentHashMap<>();
	private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

	@PostConstruct
	public void startPingTask() {
		scheduler.scheduleAtFixedRate(() -> {
			for (Map.Entry<Long, SseEmitter> entry : emitterMap.entrySet()) {
				try {
					entry.getValue().send(SseEmitter.event()
						.name("ping")
						.data("keep-alive"));
				} catch (IOException e) {
					entry.getValue().completeWithError(e);
					emitterMap.remove(entry.getKey());
				}
			}
		}, 0, 20, TimeUnit.SECONDS); // 20초마다 ping
	}

	@PreDestroy
	public void shutdownScheduler() {
		scheduler.shutdown();
	}


	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);

		// 저장
		emitterMap.put(userId, emitter);

		// 연결 종료 처리
		emitter.onCompletion(() -> emitterMap.remove(userId));
		emitter.onTimeout(() -> emitterMap.remove(userId));
		emitter.onError(e -> emitterMap.remove(userId));

		try {
			// 연결 확인용 초기 메시지 전송
			emitter.send(SseEmitter.event()
				.name("connect")
				.data("SSE 연결 완료"));
		} catch (IOException e) {
			emitter.completeWithError(e);
		}

		return emitter;
	}

	public void sendNotification(NotificationEvent event) {
		SseEmitter emitter = emitterMap.get(event.getUserId());
		if (emitter != null) {
			try {
				emitter.send(SseEmitter.event()
					.name("notification")
					.data(event.getMessage()));
			} catch (IOException e) {
				emitter.completeWithError(e);
				emitterMap.remove(event.getUserId());
			}
		}
	}
}
