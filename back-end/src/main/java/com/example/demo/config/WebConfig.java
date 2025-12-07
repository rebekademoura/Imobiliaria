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

        // Origem do seu front (Next.js)
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // Ou, se quiser ser mais amplo:
        // config.setAllowedOriginPatterns(List.of("http://localhost:3000"));

        // Métodos liberados
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Headers que aceitamos (Authorization, Content-Type, etc)
        config.setAllowedHeaders(List.of("*"));

        // Se algum dia você usar cookies/autenticação com credenciais
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica para todas as rotas da API
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
