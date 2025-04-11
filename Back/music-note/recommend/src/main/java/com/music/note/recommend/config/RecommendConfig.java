package com.music.note.recommend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {"com.music.note.recommend.repository.recommend"},//적용 repository 패키지경로
	mongoTemplateRef = RecommendConfig.MONGO_TEMPLATE
)
public class RecommendConfig {
	protected static final String MONGO_TEMPLATE = "recommendMongoTemplate";
}
