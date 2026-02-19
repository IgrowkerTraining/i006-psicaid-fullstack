package com.example.authbackend.config;

import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final ProfessionalRepository professionalRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        // Cuando el filtro JWT pida buscar un usuario, usaremos nuestro repositorio
        return username -> professionalRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Profesional no encontrado en la base de datos"));
    }
}