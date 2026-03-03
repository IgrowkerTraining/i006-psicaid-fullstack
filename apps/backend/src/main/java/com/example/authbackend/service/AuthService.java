package com.example.authbackend.service;

import com.example.authbackend.dto.AuthResponse;
import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.ProfessionalDTO;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.model.LogCriticality;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfessionalRepository professionalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LogService logService;

    /**
     * Registra un nuevo profesional en el sistema.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Verificamos si el email ya existe
        if (professionalRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // Mapeamos DTO a Entidad y ciframos la contraseña
        Professional professional = Professional.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        Professional savedProfessional = professionalRepository.save(professional);

        // Generamos el token JWT
        String token = jwtService.generateToken(savedProfessional.getEmail());

        logService.recordLog(LogCriticality.LOW, "Nuevo profesional registrado", savedProfessional);

        return new AuthResponse(
                mapToDTO(savedProfessional),
                token,
                "Profesional registrado exitosamente"
        );
    }

    /**
     * Valida las credenciales y genera un token de acceso.
     */
    public AuthResponse login(LoginRequest request) {
        Professional professional = professionalRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), professional.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        logService.recordLog(
                LogCriticality.LOW,
                "Inicio de sesión exitoso",
                professional
        );

        String token = jwtService.generateToken(professional.getEmail());

        return new AuthResponse(
                mapToDTO(professional),
                token,
                "Inicio de sesión exitoso"
        );
    }

    /**
     * Registra el cierre de sesión en la tabla de auditoría.
     */
    public void logout() {
        // Obtenemos el email del token JWT actual
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Buscamos la entidad del profesional
        Professional professional = professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        logService.recordLog(
                LogCriticality.LOW,"Cierre de sesión", professional
        );
    }

    // Helper manual para evitar exponer la entidad Professional
    private ProfessionalDTO mapToDTO(Professional professional) {
        return ProfessionalDTO.builder()
                .id(professional.getId())
                .firstName(professional.getFirstName())
                .lastName(professional.getLastName())
                .email(professional.getEmail())
                .build();
    }
}