// UserService.java
package com.example.demo.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // ✅ ADICIONE

import com.example.demo.Models.UserModel;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.dtos.UserDTO;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    // encoder simples, sem precisar de @Bean
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    public List<UserModel> getAll() {
        return repository.findAll();
    }

    public UserModel find(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public UserModel insert(UserDTO dto) {
        UserModel model = new UserModel();
        model.setName(dto.getName());
        model.setEmail(dto.getEmail());
        model.setRole(dto.getRole());

        // 🔐 CRIPTOGRAFIA AQUI (obrigatória no insert)
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
        model.setPassword(ENCODER.encode(dto.getPassword()));

        return repository.save(model);
    }

    public UserModel update(UserDTO dto) {
        UserModel model = find(dto.getId());
        if (model == null) return null;

        model.setName(dto.getName());
        model.setEmail(dto.getEmail());
        model.setRole(dto.getRole());

        // 🔐 Se vier senha nova, re-hash
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            model.setPassword(ENCODER.encode(dto.getPassword()));
        }

        return repository.save(model);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
