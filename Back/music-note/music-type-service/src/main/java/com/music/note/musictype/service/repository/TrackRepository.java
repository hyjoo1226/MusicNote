package com.music.note.musictype.service.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.trackdomain.domain.Track;

@Repository
public interface TrackRepository extends MongoRepository<Track, String> {
	List<Track> findByTitleIn(List<String> musicList);

	List<Track> findBySpotifyIdIn(List<String> spotifyIds);

	Track findBySpotifyId(String spotifyId);
}
