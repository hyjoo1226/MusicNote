package com.music.note.musictype.consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import com.music.note.common.exception.handler.GlobalExceptionHandler;

@Import(GlobalExceptionHandler.class)
@SpringBootApplication
public class MusicTypeConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicTypeConsumerApplication.class, args);
	}

}
