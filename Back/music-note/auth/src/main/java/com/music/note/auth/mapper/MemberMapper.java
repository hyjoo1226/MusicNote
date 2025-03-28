package com.music.note.auth.mapper;

import static com.music.note.auth.constant.Role.*;
import static com.music.note.auth.constant.SocialType.*;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.music.note.auth.domain.Member;
import com.music.note.auth.dto.SpotifyMemberDto;

@Component
public class MemberMapper {
	public Member dtoToEntity(SpotifyMemberDto spotifyMemberDto){
		return Member.builder()
			.email(spotifyMemberDto.getEmail())
			.name(spotifyMemberDto.getName())
			.socialId(spotifyMemberDto.getSocialId())
			.role(USER)
			.socialType(SPOTIFY)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.lastLoginDate(LocalDateTime.now())
			.build();
	}
}
