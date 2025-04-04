package com.music.note.recommend.service.like.movie;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.recommend.domain.RecommendMovieNotFoundException;
import com.music.note.recommend.domain.like.movie.RecommendMovieLikes;
import com.music.note.recommend.domain.recommned.movie.RecommendMovie;
import com.music.note.recommend.dto.like.movie.request.RequestRecommendMovieLikeDto;
import com.music.note.recommend.dto.movie.RecommendMovieDto;
import com.music.note.recommend.dto.movie.response.ResponseRecommendMovieList;
import com.music.note.recommend.mapper.like.movie.RecommendMovieLikeMapper;
import com.music.note.recommend.repository.recommend.like.movie.RecommendMovieLikeRepository;
import com.music.note.recommend.service.common.RecommendCommonService;
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
	public void likeRecommendMovie(String userId, RequestRecommendMovieLikeDto dto) {
		RecommendMovie recommendMovie = recommendMovieService.findRecommendMovieById(dto.getRecommendMovieId());
		Optional<RecommendMovieLikes> optionalRecommendMovieLikes = recommendMovieLikeRepository.findByUserId(userId);
		if (optionalRecommendMovieLikes.isPresent()){
			RecommendMovieLikes recommendMovieLikes = optionalRecommendMovieLikes.get();
			recommendMovieLikes.addLike(recommendMovie.getId());
		}
		else {
			RecommendMovieLikes recommendMovieLikes =recommendMovieLikeMapper.createRecommendMovieLikes(recommendMovie.getId(), userId);
			recommendMovieLikeRepository.save(recommendMovieLikes);
		}
	}

	public ResponseRecommendMovieList readLikeRecommendMovie(String userId) {
		RecommendMovieLikes recommendMovieLikes = findRecommendMovieLikesByUserId(userId);
		List<String> likedMusicIds = recommendMovieLikes.getLikedMusicIds();
		ResponseRecommendMovieList responseRecommendMovieList = new ResponseRecommendMovieList();
		for (String id : likedMusicIds){
			RecommendMovie recommendMovie = recommendMovieService.findRecommendMovieById(id);
			RecommendMovieDto recommendMovieDto = recommendMovie.EntityToDto();
			responseRecommendMovieList.getMovies().add(recommendMovieDto);
		}
		responseRecommendMovieList.allocateListSize();
		return responseRecommendMovieList;
	}

	private RecommendMovieLikes findRecommendMovieLikesByUserId(String userId){
		return recommendMovieLikeRepository.findByUserId(userId)
			.orElseThrow(()-> new RecommendMovieNotFoundException(ErrorCode.NOT_FOUND_RECOMMEND_MOVIE_LIKES));
	}

	public void cancelRecommendMovieLike(String userId, String recommendMovieId) {
		RecommendMovieLikes recommendMovieLikes = findRecommendMovieLikesByUserId(userId);
		recommendMovieLikes.removeLike(recommendMovieId);
	}
}
