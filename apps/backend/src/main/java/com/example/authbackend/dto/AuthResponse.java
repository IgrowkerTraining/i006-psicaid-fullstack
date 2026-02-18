package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    // CAMBIO CLAVE: Antes era UserDTO, ahora es ProfessionalDTO
    private ProfessionalDTO user;
    private String token;
    private String message;
}