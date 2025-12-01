package com.example.demo.Security;

import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
  // Troque por uma chave >= 32 chars e mova para variável de ambiente em produção
  private static final String SECRET = "troque-esta-chave-secreta-32+caracteres-por-favor-!!!";
  private static final long EXP_MS = 60 * 60 * 1000; // 1h

  public String generate(String subject) {
    var now = new Date();
    return Jwts.builder()
      .setSubject(subject)
      .setIssuedAt(now)
      .setExpiration(new Date(now.getTime() + EXP_MS))
      .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
      .compact();
  }

  public String validateAndGetSubject(String token) {
    return Jwts.parserBuilder()
      .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }
}
