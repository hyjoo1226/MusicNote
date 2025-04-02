package com.music.note.recommend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {"com.music.note.recommend.repository.personality"},//적용 repository 패키지경로
	mongoTemplateRef = TypeConfig.MONGO_TEMPLATE
)
public class TypeConfig {
	protected static final String MONGO_TEMPLATE = "typeMongoTemplate";
}
