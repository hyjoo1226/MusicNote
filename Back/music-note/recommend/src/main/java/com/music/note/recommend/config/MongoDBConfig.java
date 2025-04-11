package com.music.note.recommend.config;

import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoDBConfig {

	@Primary
	@Bean(name = "recommendProperties")
	@ConfigurationProperties(prefix = "spring.data.mongodb.recommend")
	public MongoProperties getRecommendProps() throws Exception {
		return new MongoProperties();
	}

	@Bean(name = "typeProperties")
	@ConfigurationProperties(prefix = "spring.data.mongodb.type")
	public MongoProperties getTypeProps() throws Exception {
		return new MongoProperties();
	}

	@Primary
	@Bean(name = "recommendMongoTemplate")
	public MongoTemplate primaryMongoTemplate() throws Exception {
		return new MongoTemplate(recommendMongoDatabaseFactory(getRecommendProps()));
	}

	@Bean(name ="typeMongoTemplate")
	public MongoTemplate secondaryMongoTemplate() throws Exception {
		return new MongoTemplate(typeMongoDatabaseFactory(getTypeProps()));
	}

	@Primary
	@Bean
	public MongoDatabaseFactory recommendMongoDatabaseFactory(MongoProperties mongo) throws Exception {
		return new SimpleMongoClientDatabaseFactory(
			mongo.getUri()
		);
	}

	@Bean
	public MongoDatabaseFactory typeMongoDatabaseFactory(MongoProperties mongo) throws Exception {
		return new SimpleMongoClientDatabaseFactory(
			mongo.getUri()
		);
	}
}