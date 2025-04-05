package com.music.note.recommend.service.like.book;

import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.recommend.like.book.RecommendBookLikesNotFoundException;
import com.music.note.recommend.domain.like.book.RecommendBookLikes;
import com.music.note.recommend.domain.recommned.book.RecommendBook;
import com.music.note.recommend.dto.book.RecommendBookDto;
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.dto.like.book.request.RequestRecommendBookLikeDto;
import com.music.note.recommend.dto.movie.RecommendMovieDto;
import com.music.note.recommend.mapper.domain.book.RecommendBookMapper;
import com.music.note.recommend.mapper.like.book.RecommendBookLikeMapper;
import com.music.note.recommend.repository.recommend.like.book.RecommendBookLikeRepository;
import com.music.note.recommend.service.domain.book.RecommendBookService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendBookLikeService {

	private final RecommendBookService recommendBookService;
	private final RecommendBookLikeRepository recommendBookLikeRepository;
	private final RecommendBookLikeMapper recommendBookLikeMapper;
	private final RecommendBookMapper recommendBookMapper;
	public void likeRecommendBook(String userId, String recommendBookId){
		RecommendBook recommendBook = recommendBookService.findRecommendBookById(recommendBookId);
		Optional<RecommendBookLikes> optionalRecommendBookLikes = recommendBookLikeRepository.findByUserId(userId);

		if (optionalRecommendBookLikes.isPresent()){
			RecommendBookLikes recommendBookLikes = optionalRecommendBookLikes.get();
			recommendBookLikeRepository.addMovieLike(recommendBookLikes.getId(), recommendBook.getId());

		}
		else {
			RecommendBookLikes recommendMovieLikes = recommendBookLikeMapper.createRecommendBookLikes(recommendBook.getId(), userId);
			recommendBookLikeRepository.save(recommendMovieLikes);
		}
	}

	public ResponseRecommendBookList readLikeRecommendBook(String userId) {
		RecommendBookLikes recommendBookLikes = findRecommendBookLikesByUserId(userId);
		List<String> likedBookIds = recommendBookLikes.getLikedBookIds();
		List<RecommendBookDto> recommendBookDtoList = new ArrayList<>();
		for (String id: likedBookIds){
			RecommendBook recommendBook = recommendBookService.findRecommendBookById(id);
			RecommendBookDto recommendBookDto = recommendBookMapper.entityToDto(userId, recommendBook);
			recommendBookDtoList.add(recommendBookDto);
		}
		return ResponseRecommendBookList
			.builder()
			.books(recommendBookDtoList)
			.listSize(recommendBookDtoList.size())
			.build();
	}
	private RecommendBookLikes findRecommendBookLikesByUserId(String userId){
		return recommendBookLikeRepository.findByUserId(userId)
			.orElseThrow(()-> new RecommendBookLikesNotFoundException(NOT_FOUND_RECOMMEND_BOOK_LIKES));
	}
}
