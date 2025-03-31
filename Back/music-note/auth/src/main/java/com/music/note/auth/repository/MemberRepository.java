package com.music.note.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.music.note.auth.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
	Optional<Member> findBySocialId(String socialId);
}
