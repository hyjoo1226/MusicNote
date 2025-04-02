package com.music.note.trackdomain.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tracks") // 컬렉션 이름: "tracks"
public class Track {

	@Id
	private String objectId; // MongoDB의 기본 ObjectId (삽입 성능 최적화)

	@Indexed(unique = true) // Spotify ID에 대한 고유 인덱스 적용
	private String spotifyId; // Spotify의 고유 트랙 ID

	private String title;
	private String artist;
	private String imageUrl;

	private AudioFeatures audioFeatures;

	// private MusicScores musicScores;
}