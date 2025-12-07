package com.example.demo.Controller;

import com.example.demo.Models.UserModel;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Services.TokenService;
import com.example.demo.dtos.AuthResponseDTO;
import com.example.demo.dtos.LoginRequestDTO;
import com.example.demo.dtos.UserDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {

        // 1) Busca usuário por e-mail
        Optional<UserModel> optUser = userRepository.findByEmail(data.getEmail());
        if (optUser.isEmpty()) {
            // usuário não existe
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Credenciais inválidas"));
        }

        UserModel user = optUser.get();

        // 2) Compara senha informada com a senha criptografada no banco (BCrypt)
        boolean senhaOk = passwordEncoder.matches(data.getPassword(), user.getPassword());
        if (!senhaOk) {
            // senha errada
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Credenciais inválidas"));
        }

        // 3) Gera o token JWT (já usando role e name se você configurou isso no TokenService)
        String token = tokenService.generateToken(user);

        // 4) Monta DTO de usuário para devolver pro front
        UserDTO userDTO = new UserDTO(user);
        AuthResponseDTO response = new AuthResponseDTO(token, userDTO);

        return ResponseEntity.ok(response);
    }
}
