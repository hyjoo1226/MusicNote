package com.music.note.musictype.consumer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.typedomain.domain.WeeklyReport;

@Repository
public interface WeeklyReportRepository extends MongoRepository<WeeklyReport, String> {

}
