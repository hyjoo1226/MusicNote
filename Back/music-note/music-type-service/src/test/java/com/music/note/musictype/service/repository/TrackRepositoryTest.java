package com.music.note.musictype.service.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import com.music.note.trackdomain.domain.AudioFeatures;
import com.music.note.trackdomain.domain.Track;

@DataMongoTest
class TrackRepositoryTest {

	@Autowired
	private TrackRepository trackRepository;

	@Test
	@DisplayName("findByTitleIn으로 여러 트랙 제목으로 검색")
	void findByTitleInTest() {
		trackRepository.deleteAll();
		trackRepository.saveAll(List.of(
			new Track(null, "1A2B3C4D5E", "music1", "Luna Waves",
				new AudioFeatures(0.75, 0.15, 0.60, 0.05, 0.12, 120.0, 0.80, -5.2, 0.78)),
			new Track(null, "1A2B3C4D5F", "music2", "Luna Waves",
				new AudioFeatures(0.70, 0.10, 0.55, 0.04, 0.10, 115.0, 0.75, -6.0, 0.74)),
			new Track(null, "1A2B3C4D5G", "music3", "Luna Waves",
				new AudioFeatures(0.65, 0.20, 0.50, 0.06, 0.15, 110.0, 0.70, -5.8, 0.72))
		));

		// when
		List<Track> results = trackRepository.findByTitleIn(List.of("music1", "music2"));

		// then
		assertThat(results).extracting(Track::getTitle)
			.containsExactlyInAnyOrder("music1", "music2");
	}

}
