package com.music.note.recommend.repository.personality;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.music.note.typedomain.domain.PersonalityReport;

@Repository
public interface ReportRepository extends MongoRepository<PersonalityReport,String> {
	Optional<PersonalityReport> findTopByUserIdOrderByCreatedAtDesc(String userId);
	@Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lt: ?2 } }")
	List<PersonalityReport> findByUserIdAndCreatedAtBetween(String userId, Date start, Date end);
}
