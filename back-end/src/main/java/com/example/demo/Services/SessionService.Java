// src/main/java/com/example/demo/security/SessionService.java
package com.example.demo.security;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {
  private final Map<String, Integer> sessions = new ConcurrentHashMap<>();

  public String create(Integer userId) {
    String token = UUID.randomUUID().toString();
    sessions.put(token, userId);
    return token;
  }

  public Integer getUserId(String token) {
    return token == null ? null : sessions.get(token);
  }

  public void delete(String token) {
    if (token != null) sessions.remove(token);
  }
}
