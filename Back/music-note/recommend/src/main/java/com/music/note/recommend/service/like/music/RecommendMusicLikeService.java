package com.music.note.recommend.service.like.music;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.recommend.like.book.RecommendBookLikesNotFoundException;
import com.music.note.recommend.domain.like.music.RecommendMusicLikes;
import com.music.note.recommend.domain.recommned.music.RecommendMusic;
import com.music.note.recommend.dto.like.music.request.RequestRecommendMusicLikeDto;
import com.music.note.recommend.dto.music.RecommendMusicDto;
import com.music.note.recommend.dto.music.response.ResponseRecommendMusicList;
import com.music.note.recommend.mapper.domain.music.RecommendMusicMapper;
import com.music.note.recommend.mapper.like.music.RecommendMusicLikeMapper;
import com.music.note.recommend.repository.recommend.like.movie.RecommendMovieLikeRepository;
import com.music.note.recommend.repository.recommend.like.music.RecommendMusicLikeRepository;
import com.music.note.recommend.service.domain.music.RecommendMusicService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendMusicLikeService {

	private final RecommendMusicLikeRepository recommendMusicLikeRepository;
	private final RecommendMusicService recommendMusicService;
	private final RecommendMusicLikeMapper recommendMusicLikeMapper;
	private final RecommendMusicMapper recommendMusicMapper;

	public void likeRecommendMusic(String userId, RequestRecommendMusicLikeDto requestRecommendMusicLikeDto) {
		RecommendMusic recommendMusic = recommendMusicService.findRecommendMusicById(requestRecommendMusicLikeDto.getRecommendMusicId());
		Optional<RecommendMusicLikes> optionalRecommendMusicLikes = recommendMusicLikeRepository.findByUserId(userId);
		if (optionalRecommendMusicLikes.isPresent()){
			RecommendMusicLikes recommendMusicLikes = optionalRecommendMusicLikes.get();
			if (!recommendMusicLikes.isLikedBySpotifyMusicId(recommendMusic.getSpotifyMusicId())){
				recommendMusicLikeRepository.addMusicLikeBySpotifyMusicId(recommendMusicLikes.getId(), recommendMusic.getSpotifyMusicId());
			}
		}
		else {
			RecommendMusicLikes recommendMusicLikes = recommendMusicLikeMapper.createRecommendMusicLikes(recommendMusic.getSpotifyMusicId(), userId);
			recommendMusicLikeRepository.save(recommendMusicLikes);
		}
	}

	public ResponseRecommendMusicList readLikeRecommendMusic(String userId) {
		Optional<RecommendMusicLikes> optionalRecommendMusicLikes = findOptionalRecommendMusicLikesByUserId(userId);
		if (optionalRecommendMusicLikes.isEmpty()){
			return ResponseRecommendMusicList.builder()
				.musics(new ArrayList<>())
				.listSize(0)
				.build();
		}
		RecommendMusicLikes recommendMusicLikes = optionalRecommendMusicLikes.get();
		List<String> likeMusicSpotifyMusicIds = recommendMusicLikes.getLikeMusicSpotifyMusicIds();
		List<RecommendMusicDto> recommendMusicDtoList = new ArrayList<>();
		for (String spotifyMusicId : likeMusicSpotifyMusicIds){
			// RecommendMusic recommendMusicById = recommendMusicService.findRecommendMusicById(id);
			RecommendMusic recommendMusicById = recommendMusicService.findRecommendMusicBySpotifyId(spotifyMusicId);
			RecommendMusicDto recommendMusicDto = recommendMusicMapper.entityToRecommendMusicDto(recommendMusicById);
			recommendMusicDtoList.add(recommendMusicDto);
		}
		return ResponseRecommendMusicList.builder()
			.musics(recommendMusicDtoList)
			.listSize(recommendMusicDtoList.size())
			.build();
	}
	private RecommendMusicLikes findRecommendMusicLikesByUserId(String userId){
		return recommendMusicLikeRepository.findByUserId(userId)
			.orElseThrow(() -> new RecommendBookLikesNotFoundException(NOT_FOUND_RECOMMEND_MUSIC_LIKES));
	}
	private Optional<RecommendMusicLikes> findOptionalRecommendMusicLikesByUserId(String userId){
		return recommendMusicLikeRepository.findByUserId(userId);
	}


	public void cancelRecommendMusicLike(String userId, RequestRecommendMusicLikeDto requestRecommendMusicLikeDto) {
		RecommendMusicLikes recommendMusicLikes = findRecommendMusicLikesByUserId(userId);
		recommendMusicLikeRepository.removeMusicLike(recommendMusicLikes.getId(), requestRecommendMusicLikeDto.getSpotifyMusicId());
	}
}
