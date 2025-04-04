package com.music.note.recommend.service.domain.music;

import java.util.List;

import org.springframework.stereotype.Service;


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
		saveRecommendMusic(recommendMusicByDataServer.getMusics(), String.valueOf(memberId));
		return recommendMusicByDataServer;
	}
	private ResponseRecommendMusicList getRecommendMusicByDataServer(RequestLatestPersonalityReportDto personalityReportDto){
		// String dataUrl = "http://13.125.215.33:8100/recommend/book";
		String dataUrl = "http://13.125.215.33:8100/data/api/recommend/music/test";
		return recommendCommonService.getRecommendations(dataUrl,
			personalityReportDto, ResponseRecommendMusicList.class);
	}
	private void saveRecommendMusic(List<RecommendMusicDto> musicDtos, String memberId){
		for (RecommendMusicDto dto: musicDtos){
			RecommendMusic recommendMusic = recommendMusicMapper.dtoToEntity(dto, String.valueOf(memberId));
			RecommendMusic save = recommendMusicRepository.save(recommendMusic);
			dto.setId(save.getId());
		}
	}
}
