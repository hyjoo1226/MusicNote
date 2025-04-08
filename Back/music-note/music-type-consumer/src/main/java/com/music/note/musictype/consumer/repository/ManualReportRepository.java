package com.music.note.musictype.consumer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.music.note.typedomain.domain.ManualReport;

public interface ManualReportRepository extends MongoRepository<ManualReport, String> {

}
