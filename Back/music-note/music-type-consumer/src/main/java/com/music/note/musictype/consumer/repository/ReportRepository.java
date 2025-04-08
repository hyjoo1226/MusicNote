package com.music.note.musictype.consumer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.typedomain.domain.PersonalityReport;

@Repository
public interface ReportRepository extends MongoRepository<PersonalityReport, String> {
	List<PersonalityReport> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);
}
