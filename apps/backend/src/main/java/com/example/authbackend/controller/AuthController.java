package com.example.authbackend.controller;

import com.example.authbackend.dto.AuthResponse;
import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.ProfessionalDTO;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.service.AuthService;
import com.example.authbackend.service.ProfessionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para la gestión de autenticación y registro de profesionales.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ProfessionalService professionalService;

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
    /**
     * Endpoint para validar el token actual y devolver los datos del psicólogo.
     * Si el token expiró, el JwtFilter devolverá 401 antes de llegar aquí.
     */
    @GetMapping("/me")
    public ResponseEntity<ProfessionalDTO> getCurrentUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ProfessionalDTO professionalDTO = professionalService.getProfessionalByEmail(email);

        return ResponseEntity.ok(professionalDTO);
    }

    /**
     * Endpoint para registrar el cierre de sesión en la auditoría.
     * El frontend debe llamar a este endpoint con el token ANTES de borrarlo del localStorage.
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authService.logout();
        return ResponseEntity.ok("Sesión cerrada correctamente. Log registrado.");
    }
}