package com.music.note.musiccrawler.consumer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.trackdomain.domain.Track;

@Repository
public interface TrackRepository extends MongoRepository<Track, String> {
}
