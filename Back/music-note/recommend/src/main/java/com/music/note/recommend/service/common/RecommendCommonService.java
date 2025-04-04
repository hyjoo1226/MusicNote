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
import com.music.note.recommend.mapper.report.ReportMapper;
import com.music.note.recommend.repository.personality.ReportRepository;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendCommonService {

	private final ReportRepository personalityRepository;
	private final ReportMapper personalityMapper;

	private final RestTemplate restTemplate;
	private PersonalityReport getPersonalityReportByMemberId(String userId){
		PersonalityReport report = getLatestReportByUserId(userId);
		log.info("PersonalityReport: {}", report);
		return report;

	}
	public RequestLatestPersonalityReportDto getRequestLatestPersonalityReportDto(String userId){
		PersonalityReport report = getPersonalityReportByMemberId(userId);
		RequestLatestPersonalityReportDto personalityReportDto = personalityMapper.entityToDto(report);
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
		log.info("data server response{}=", responseEntity.getBody());
		return responseEntity.getBody();
	}
}
