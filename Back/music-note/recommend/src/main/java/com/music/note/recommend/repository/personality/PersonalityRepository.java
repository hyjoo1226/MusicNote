package com.music.note.recommend.repository.personality;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.music.note.typedomain.domain.PersonalityReport;

@Repository
public interface PersonalityRepository extends MongoRepository<PersonalityReport,String> {
	Optional<PersonalityReport> findTopByUserIdOrderByCreatedAtDesc(String userId);
}
