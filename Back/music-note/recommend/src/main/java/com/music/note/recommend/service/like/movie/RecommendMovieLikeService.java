package com.music.note.recommend.service.like.movie;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.recommend.domain.movie.RecommendMovieNotFoundException;
import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;
import com.music.note.recommend.domain.recommned.movie.RecommendMovie;
import com.music.note.recommend.dto.like.movie.request.RequestRecommendMovieLikeDto;
import com.music.note.recommend.dto.movie.RecommendMovieDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.mapper.like.movie.RecommendMovieLikeMapper;
import com.music.note.recommend.repository.recommend.like.movie.RecommendMovieLikeRepository;
import com.music.note.recommend.service.domain.movie.RecommendMovieService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendMovieLikeService {

	private final RecommendMovieService recommendMovieService;
	private final RecommendMovieLikeRepository recommendMovieLikeRepository;
	private final RecommendMovieLikeMapper recommendMovieLikeMapper;
	public void likeRecommendMovie(String userId, RequestRecommendMovieLikeDto requestRecommendMovieLikeDto) {

		RecommendMovie recommendMovie = recommendMovieService.findRecommendMovieById(requestRecommendMovieLikeDto.getRecommendMovieId());
		Optional<RecommendMovieLikes> optionalRecommendMovieLikes = recommendMovieLikeRepository.findByUserId(userId);

		if (optionalRecommendMovieLikes.isPresent()){

			RecommendMovieLikes recommendMovieLikes = optionalRecommendMovieLikes.get();
			recommendMovieLikeRepository.addMovieLike(recommendMovieLikes.getId(), requestRecommendMovieLikeDto.getRecommendMovieId());


		}
		else {
			RecommendMovieLikes recommendMovieLikes =recommendMovieLikeMapper.createRecommendMovieLikes(recommendMovie.getId(), userId);
			recommendMovieLikeRepository.save(recommendMovieLikes);
		}
	}

	public ResponseRecommendMovieList readLikeRecommendMovie(String userId) {
		RecommendMovieLikes recommendMovieLikes = findRecommendMovieLikesByUserId(userId);
		List<String> likedMusicIds = recommendMovieLikes.getLikedMovieIds();
		List<RecommendMovieDto> recommendMovieDtoList = new ArrayList<>();
		for (String id : likedMusicIds){
			RecommendMovie recommendMovie = recommendMovieService.findRecommendMovieById(id);
			RecommendMovieDto recommendMovieDto = recommendMovie.EntityToDto();
			recommendMovieDtoList.add(recommendMovieDto);
		}
		return ResponseRecommendMovieList
			.builder()
			.movies(recommendMovieDtoList)
			.listSize(recommendMovieDtoList.size())
			.build();
	}

	private RecommendMovieLikes findRecommendMovieLikesByUserId(String userId){
		return recommendMovieLikeRepository.
			findByUserId(userId)
			.orElseThrow(()-> new RecommendMovieNotFoundException(ErrorCode.NOT_FOUND_RECOMMEND_MOVIE_LIKES));
	}

	public void cancelRecommendMovieLike(String userId, RequestRecommendMovieLikeDto requestRecommendMovieLikeDto) {
		RecommendMovieLikes recommendMovieLikes = findRecommendMovieLikesByUserId(userId);
		recommendMovieLikeRepository.removeMovieLike(recommendMovieLikes.getId(), requestRecommendMovieLikeDto.getRecommendMovieId());
	}
}
