package com.music.note.recommend.service.domain.movie;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.domain.recommend.domain.RecommendMovieNotFoundException;
import com.music.note.recommend.domain.recommned.movie.RecommendMovie;
import com.music.note.recommend.dto.movie.RecommendMovieDto;
import com.music.note.recommend.dto.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.mapper.domain.movie.RecommendMovieMapper;
import com.music.note.recommend.repository.recommend.movie.RecommendMovieRepository;
import com.music.note.recommend.service.common.RecommendCommonService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendMovieService {

	private final RecommendMovieMapper recommendMovieMapper;
	private final RecommendMovieRepository recommendMovieRepository;
	private final RecommendCommonService recommendCommonService;

	public ResponseRecommendMovieList recommendMovies(String memberId) {
		try {
			RequestLatestPersonalityReportDto personalityReportDto = recommendCommonService.getRequestLatestPersonalityReportDto(memberId);
			ResponseRecommendMovieList recommendMoviesByDataServer = getRecommendMoviesByDataServer(personalityReportDto);
			recommendMoviesByDataServer.allocateListSize();
			saveRecommendMovie(recommendMoviesByDataServer.getMovies(), memberId);
			return recommendMoviesByDataServer;
		}
		catch (Exception e){
			log.error("에러입니다: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	private void saveRecommendMovie(List<RecommendMovieDto> movies, String memberId){
		for (RecommendMovieDto dto: movies){
			RecommendMovie recommendMovie = recommendMovieMapper.dtoToEntity(dto, memberId);
			RecommendMovie save = recommendMovieRepository.save(recommendMovie);
			dto.setId(save.getId());
		}
	}

	private ResponseRecommendMovieList getRecommendMoviesByDataServer(RequestLatestPersonalityReportDto personalityReportDto){
		// String dataUrl = "http://13.125.215.33:8100/recommend/movie";
		String dataUrl = "http://13.125.215.33:8100/data/api/recommend/movie";
		return recommendCommonService.getRecommendations(dataUrl,
			personalityReportDto, ResponseRecommendMovieList.class);
	}

	public RecommendMovie findRecommendMovieById(String id){
		return recommendMovieRepository.findById(id)
			.orElseThrow(() -> new RecommendMovieNotFoundException(id, NOT_FOUND_RECOMMEND_MOVIE));

	}

	public ResponseRecommendMovieList readRecommendMovies(String userId) {
		List<RecommendMovie> recommendMovieList = recommendMovieRepository.findTop20ByUserIdOrderByCreatedAtDesc(
			userId);
		List<RecommendMovieDto> recommendMovieDtoList = new ArrayList<>();
		for (RecommendMovie recommendMovie : recommendMovieList){
			RecommendMovieDto recommendMovieDto = recommendMovie.EntityToDto();
			recommendMovieDtoList.add(recommendMovieDto);
		}
		return ResponseRecommendMovieList.builder()
			.movies(recommendMovieDtoList)
			.listSize(recommendMovieDtoList.size())
			.build();
	}
}
