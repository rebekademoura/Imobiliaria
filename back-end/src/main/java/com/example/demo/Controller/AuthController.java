package com.example.demo.Controller;

import com.example.demo.Models.UserModel;
import com.example.demo.Services.TokenService;
import com.example.demo.dtos.AuthResponseDTO;
import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.LoginRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword =
            new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
        var auth = authManager.authenticate(usernamePassword);

        var user = (UserModel) auth.getPrincipal();

        String token = tokenService.generateToken(user);

        UserDTO userDTO = new UserDTO(user);

        AuthResponseDTO response = new AuthResponseDTO(token, userDTO);

        return ResponseEntity.ok(response);
    }
}
