package com.example.authbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterProfessionalRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    public RegisterProfessionalRequest() {
    }

    public RegisterProfessionalRequest(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

