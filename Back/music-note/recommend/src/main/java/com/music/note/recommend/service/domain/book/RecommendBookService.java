package com.music.note.recommend.service.domain.book;


import static com.music.note.common.exception.exception.common.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.domain.recommend.domain.book.RecommendBookNotFoundException;
import com.music.note.recommend.domain.recommned.book.RecommendBook;
import com.music.note.recommend.dto.book.RecommendBookDto;
import com.music.note.recommend.dto.book.response.ResponseRecommendBookList;
import com.music.note.recommend.dto.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.mapper.domain.book.RecommendBookMapper;
import com.music.note.recommend.repository.recommend.book.RecommendBookRepository;
import com.music.note.recommend.service.common.RecommendCommonService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendBookService {
	private final RecommendCommonService recommendCommonService;

	private final RecommendBookRepository recommendBookRepository;

	private final RecommendBookMapper recommendBookMapper;

	public ResponseRecommendBookList recommendBooks(String memberId) {
		RequestLatestPersonalityReportDto personalityReportDto = recommendCommonService.getRequestLatestPersonalityReportDto(memberId);
		ResponseRecommendBookList recommendMoviesByDataServer = getRecommendBooksByDataServer(personalityReportDto);
		recommendMoviesByDataServer.allocateListSize();
		saveRecommendMovie(recommendMoviesByDataServer.getBooks(),memberId);
		return recommendMoviesByDataServer;
	}

	private ResponseRecommendBookList getRecommendBooksByDataServer(RequestLatestPersonalityReportDto personalityReportDto){
		String dataUrl = "http://13.125.215.33:8100/data/api/recommend/book";
		return recommendCommonService.getRecommendations(dataUrl,
			personalityReportDto, ResponseRecommendBookList.class);
	}

	private void saveRecommendMovie(List<RecommendBookDto> books, String memberId){
		for (RecommendBookDto dto: books){
			RecommendBook recommendBook = recommendBookMapper.dtoToEntity(dto, memberId);
			RecommendBook save = recommendBookRepository.save(recommendBook);
			dto.setId(save.getId());
			dto.setUserId(memberId);
		}
	}

	public ResponseRecommendBookList readRecommendBook(String userId) {
		List<RecommendBook> recommendBookList = recommendBookRepository.findTop20ByUserIdOrderByCreatedAtDesc(
			userId);
		List<RecommendBookDto> books = new ArrayList<>();
		for (RecommendBook recommendBook: recommendBookList){
			RecommendBookDto recommendBookDto = recommendBookMapper.entityToDto(userId, recommendBook);
			books.add(recommendBookDto);
		}
		return ResponseRecommendBookList.builder()
			.books(books)
			.listSize(books.size())
			.build();
	}

	public RecommendBook findRecommendBookById(String recommendBookId) {
		return recommendBookRepository.findById(recommendBookId)
			.orElseThrow(() -> new RecommendBookNotFoundException(NOT_FOUND_RECOMMEND_BOOK));
	}
}
