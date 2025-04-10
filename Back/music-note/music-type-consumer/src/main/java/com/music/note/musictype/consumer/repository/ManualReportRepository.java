package com.music.note.musictype.consumer.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.music.note.typedomain.domain.ManualReport;

public interface ManualReportRepository extends MongoRepository<ManualReport, String> {
	List<ManualReport> findAllByUserId(String userId);

}
