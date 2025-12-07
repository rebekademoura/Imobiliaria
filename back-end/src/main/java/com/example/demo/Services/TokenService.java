package com.example.demo.Services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.demo.Models.UserModel;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(UserModel user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);

        return JWT.create()
                .withSubject(user.getEmail())      // sub = email
                .withClaim("role", user.getRole()) // 👈 já manda a role no token se quiser
                .withClaim("name", user.getName()) // 👈 e o nome também
                .withIssuedAt(new Date())
                .withExpiresAt(Date.from(
                        LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"))
                ))
                .sign(algorithm);
    }

    // ... validateToken etc.
}
