package com.music.note.recommend.service.domain.music;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.music.note.common.exception.exception.common.ErrorCode;
import com.music.note.common.exception.exception.domain.recommend.domain.music.RecommendMusicNotFoundException;
import com.music.note.recommend.domain.recommned.music.RecommendMusic;
import com.music.note.recommend.dto.music.RecommendMusicDto;
import com.music.note.recommend.dto.music.response.ResponseRecommendMusicList;
import com.music.note.recommend.dto.request.RequestLatestPersonalityReportDto;
import com.music.note.recommend.mapper.domain.music.RecommendMusicMapper;
import com.music.note.recommend.repository.recommend.music.RecommendMusicRepository;
import com.music.note.recommend.service.common.RecommendCommonService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecommendMusicService {

	private final RecommendCommonService recommendCommonService;
	private final RecommendMusicRepository recommendMusicRepository;
	private final RecommendMusicMapper recommendMusicMapper;

	public ResponseRecommendMusicList recommendMusic(String memberId) {
		RequestLatestPersonalityReportDto reqReportDto = recommendCommonService.getRequestLatestPersonalityReportDto(
			memberId);
		ResponseRecommendMusicList recommendMusicByDataServer = getRecommendMusicByDataServer(reqReportDto);
		recommendMusicByDataServer.allocateListSize();
		saveRecommendMusic(recommendMusicByDataServer.getMusics(), memberId);
		return recommendMusicByDataServer;
	}
	private ResponseRecommendMusicList getRecommendMusicByDataServer(RequestLatestPersonalityReportDto personalityReportDto){
		String dataUrl = "http://13.125.215.33:8100/data/api/recommend/music";
		return recommendCommonService.getRecommendations(dataUrl,
			personalityReportDto, ResponseRecommendMusicList.class);
	}
	private void saveRecommendMusic(List<RecommendMusicDto> dtoList, String memberId){
		for (RecommendMusicDto dto: dtoList){
			RecommendMusic recommendMusic = recommendMusicMapper.dtoToEntity(dto, memberId);
			RecommendMusic save = recommendMusicRepository.save(recommendMusic);
			dto.setRecommendMusicId(save.getId());
		}
	}

	public ResponseRecommendMusicList readRecommendMusic(String userId) {
		List<RecommendMusic> recommendMusicList = recommendMusicRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);
		List<RecommendMusicDto> recommendMusicDtoList = new ArrayList<>();
		for (RecommendMusic recommendMusic : recommendMusicList){
			RecommendMusicDto dto = recommendMusicMapper.entityToRecommendMusicDto(recommendMusic);
			recommendMusicDtoList.add(dto);
		}
		return ResponseRecommendMusicList.builder()
			.musics(recommendMusicDtoList)
			.listSize(recommendMusicDtoList.size())
			.build();
	}

	public RecommendMusic findRecommendMusicById(String recommendMusicId) {
		return recommendMusicRepository.findById(recommendMusicId)
			.orElseThrow(()-> new RecommendMusicNotFoundException(ErrorCode.NOT_FOUND_RECOMMEND_MUSIC));
	}


	public RecommendMusic findRecommendMusicBySpotifyId(String spotifyMusicId) {
		return recommendMusicRepository.findFirstBySpotifyMusicId(spotifyMusicId)
			.orElseThrow(()-> new RecommendMusicNotFoundException(ErrorCode.NOT_FOUND_RECOMMEND_MUSIC));
	}
}
