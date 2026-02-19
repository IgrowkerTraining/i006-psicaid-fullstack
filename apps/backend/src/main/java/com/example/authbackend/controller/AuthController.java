package com.example.authbackend.controller;

import com.example.authbackend.dto.AuthResponse;
import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para la gestión de autenticación y registro de profesionales.
 * Cumple con el requerimiento RF1 del sistema PSICAID.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // Genera el constructor para la inyección de dependencias
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // En un backend profesional, devolvemos 201 Created para registros exitosos
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Para login, un 200 OK es el estándar
        return ResponseEntity.ok(authService.login(request));
    }
}