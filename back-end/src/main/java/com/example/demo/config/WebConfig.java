// src/main/java/com/example/demo/config/WebConfig.java
package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class WebConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // front Next.js em dev
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // métodos permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // headers permitidos
        config.setAllowedHeaders(List.of("*"));
        // permite enviar cookies/Authorization
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // aplica essa config pra todas as rotas
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
