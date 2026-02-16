package com.example.authbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String username;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String name, String username) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.username = username;
    }

}
