package com.example.authbackend.dto;

import com.example.authbackend.model.User;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {
    private UserDTO user;
    private String token;
    private String message;

    public AuthResponse() {}

    public AuthResponse(UserDTO user, String token, String message) {
        this.user = user;
        this.token = token;
        this.message = message;
    }

}
