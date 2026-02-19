package com.example.authbackend.service;

import com.example.authbackend.dto.AuthResponse;
import com.example.authbackend.dto.LoginRequest;
import com.example.authbackend.dto.ProfessionalDTO;
import com.example.authbackend.dto.RegisterRequest;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfessionalRepository professionalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Registra un nuevo profesional en el sistema.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Verificamos si el email ya existe
        if (professionalRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // 2. Mapeamos DTO a Entidad y ciframos la contraseña
        Professional professional = Professional.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Nunca texto plano
                .build();

        Professional savedProfessional = professionalRepository.save(professional);

        // 3. Generamos el token JWT
        String token = jwtService.generateToken(savedProfessional.getEmail());

        // 4. Devolvemos la respuesta estructurada
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

        String token = jwtService.generateToken(professional.getEmail());

        return new AuthResponse(
                mapToDTO(professional),
                token,
                "Inicio de sesión exitoso"
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
