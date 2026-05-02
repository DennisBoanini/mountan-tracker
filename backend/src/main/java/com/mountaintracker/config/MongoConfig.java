package com.mountaintracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.mountaintracker.repository")
@EnableMongoAuditing
public class MongoConfig {
    // Spring Data crea automaticamente gli indici definiti con @Indexed sul documento
    // Per abilitare la creazione automatica degli indici aggiungi in application.properties:
    // spring.data.mongodb.auto-index-creation=true
}
