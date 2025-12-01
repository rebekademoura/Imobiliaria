package com.example.demo.dtos;

import com.example.demo.Models.UserModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String role;

    // Campo aceito somente na ENTRADA (não será serializado na resposta)
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    public UserDTO() {}

    public UserDTO(UserModel userModel) {
        if (userModel != null) {
            this.id = userModel.getId();
            this.name = userModel.getName();
            this.email = userModel.getEmail();
            this.role = userModel.getRole();
            // password não é exposto
        }
    }

    public UserDTO(Integer id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
