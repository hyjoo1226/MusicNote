package com.music.note.recommend.service;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.music.note.common.exception.exception.domain.personalityreport.PersonalityNotFoundByUserIdException;
import com.music.note.recommend.domain.RecommendMovie;
import com.music.note.recommend.dto.movie.MovieRecommendDto;
import com.music.note.recommend.dto.movie.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.mapper.PersonalityMapper;
import com.music.note.recommend.mapper.RecommendMovieMapper;
import com.music.note.recommend.repository.personality.PersonalityRepository;
import com.music.note.recommend.repository.recommend.RecommendMovieRepository;
import com.music.note.typedomain.domain.PersonalityReport;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendMovieService {

	private final PersonalityRepository personalityRepository;
	private final PersonalityMapper personalityMapper;
	private final RecommendMovieMapper recommendMovieMapper;
	private final RestTemplate restTemplate;
	private final RecommendMovieRepository recommendMovieRepository;

	public ResponseRecommendMovieList recommendMovies(Long memberId) {
		try {
			String userId = String.valueOf(memberId);
			PersonalityReport report = getLatestReportByUserId(userId);
			log.info("PersonalityReport: {}", report);
			RequestLatestPersonalityReportDto personalityReportDto = personalityMapper.EntityToDto(report);
			log.info("personalityReportDto: {}", personalityReportDto);
			ResponseRecommendMovieList recommendMoviesByDataServer = getRecommendMoviesByDataServer(personalityReportDto);
			recommendMoviesByDataServer.allocateListSize();
			List<MovieRecommendDto> movies = recommendMoviesByDataServer.getMovies();
			for (MovieRecommendDto dto: movies){
				RecommendMovie recommendMovie = recommendMovieMapper.dtoToEntity(dto, userId);
				recommendMovieRepository.save(recommendMovie);
			}

			return recommendMoviesByDataServer;
		}
		catch (Exception e){
			log.error("에러입니다: {}", e.getMessage());
			throw new RuntimeException();
		}
	}
	private PersonalityReport getLatestReportByUserId(String userId) {
		return personalityRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
			.orElseThrow(() -> new PersonalityNotFoundByUserIdException(userId, NOT_FOUND_PERSONALITY_REPORT));
	}
	private ResponseRecommendMovieList getRecommendMoviesByDataServer(RequestLatestPersonalityReportDto personalityReportDto){
		String dataUrl = "http://13.125.215.33:8100/recommend/movie";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		// 요청 객체와 헤더를 HttpEntity로 감싸기
		HttpEntity<RequestLatestPersonalityReportDto> requestEntity = new HttpEntity<>(personalityReportDto, headers);

		// FastAPI 서버로 POST 요청 보내기
		ResponseEntity<ResponseRecommendMovieList> responseEntity = restTemplate.exchange(
			dataUrl, HttpMethod.POST, requestEntity, ResponseRecommendMovieList.class);
		log.info("response body: {},", responseEntity.getBody());
		// 응답을 반환
		return responseEntity.getBody();
	}
}
