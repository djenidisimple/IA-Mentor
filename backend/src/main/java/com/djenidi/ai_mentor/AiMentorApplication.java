package com.djenidi.ai_mentor;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiMentorApplication {

    public static void main(String[] args) {
        // Chargement du fichier .env
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Injection des variables dans les propriétés système pour Spring Boot
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(AiMentorApplication.class, args);
    }
}
