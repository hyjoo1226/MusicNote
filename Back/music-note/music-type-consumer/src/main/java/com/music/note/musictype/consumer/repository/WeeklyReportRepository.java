package com.music.note.musictype.consumer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.typedomain.domain.WeeklyReport;

@Repository
public interface WeeklyReportRepository extends MongoRepository<WeeklyReport, String> {
	public List<WeeklyReport> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);
}
