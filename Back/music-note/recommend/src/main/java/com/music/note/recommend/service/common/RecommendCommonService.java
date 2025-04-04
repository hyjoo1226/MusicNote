package com.music.note.recommend.service.common;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundByUserIdException;
import com.music.note.recommend.dto.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.mapper.personality.PersonalityMapper;
import com.music.note.recommend.repository.personality.PersonalityRepository;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendCommonService {

	private final PersonalityRepository personalityRepository;
	private final PersonalityMapper personalityMapper;

	private final RestTemplate restTemplate;
	private PersonalityReport getPersonalityReportByMemberId(String userId){
		PersonalityReport report = getLatestReportByUserId(userId);
		log.info("PersonalityReport: {}", report);
		return report;

	}
	public RequestLatestPersonalityReportDto getRequestLatestPersonalityReportDto(String userId){
		PersonalityReport report = getPersonalityReportByMemberId(userId);
		RequestLatestPersonalityReportDto personalityReportDto = personalityMapper.EntityToDto(report);
		log.info("personalityReportDto: {}", personalityReportDto);
		return personalityReportDto;
	}

	private PersonalityReport getLatestReportByUserId(String userId) {
		log.info("user id={}", userId);
		return personalityRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
			.orElseThrow(() -> new PersonalityNotFoundByUserIdException(NOT_FOUND_PERSONALITY_REPORT));
	}
	public <T> T getRecommendations(String url, Object request, Class<T> responseType) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Object> requestEntity = new HttpEntity<>(request, headers);

		ResponseEntity<T> responseEntity = restTemplate.exchange(
			url, HttpMethod.POST, requestEntity, responseType);

		return responseEntity.getBody();
	}
}
