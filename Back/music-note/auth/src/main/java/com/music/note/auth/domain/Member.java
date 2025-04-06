package com.music.note.auth.domain;


import java.time.LocalDateTime;
import com.music.note.auth.constant.Role;
import com.music.note.auth.constant.SocialType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Table(name = "member")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Long memberId;

	@Column(name = "email", nullable = false, length = 100)
	private String email;

	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@Column(name = "is_deleted", nullable = false)
	private boolean isDeleted = false;

	@Column(name = "social_type", nullable = false, length = 100)
	@Enumerated(EnumType.STRING)
	private SocialType socialType;

	@Column(name = "social_id", nullable = false, length = 100)
	private String socialId;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "last_login_date")
	private LocalDateTime lastLoginDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	private Role role;

}
