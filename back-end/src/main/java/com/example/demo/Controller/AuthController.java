// src/main/java/com/example/demo/Controller/AuthController.java
package com.example.demo.Controller;

//import com.example.demo.Models.UserModel;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Security.JwtService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/auth")
public class AuthController {

  record LoginReq(String email, String password) {}
  record LoginRes(String token) {}
  record MeRes(Integer id, String name, String email, String role) {}

  @Autowired UserRepository users;
  @Autowired PasswordEncoder encoder;
  @Autowired JwtService jwt;

  @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> login(@RequestBody LoginReq body) {
    var u = users.findByEmail(body.email()).orElse(null);
    if (u == null || !encoder.matches(body.password(), u.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }
    String token = jwt.generate(u.getEmail());
    return ResponseEntity.ok(new LoginRes(token));
  }

  @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
    if (auth == null || !auth.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sem token");
    }
    String email = jwt.validateAndGetSubject(auth.substring(7));
    var u = users.findByEmail(email).orElse(null);
    if (u == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado");
    return ResponseEntity.ok(new MeRes(u.getId(), u.getName(), u.getEmail(), u.getRole()));
  }
}
