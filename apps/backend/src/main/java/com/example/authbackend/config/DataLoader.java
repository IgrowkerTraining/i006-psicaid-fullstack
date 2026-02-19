package com.example.authbackend.config;

import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProfessionalRepository professionalRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (professionalRepository.count() == 0) {
            System.out.println("🌱 Sembrando datos iniciales de PSICAID...");

            // 1. Creamos a la profesional (Dra. Claire Moreau según el Storytelling)
            Professional pro = Professional.builder()
                    .firstName("Claire")
                    .lastName("Moreau")
                    .email("claire.moreau@psicaid.com")
                    .password(passwordEncoder.encode("psicaid2026")) // Siempre encriptada
                    .build();

            professionalRepository.save(pro);

            // 2. Creamos a la paciente (Laura Méndez según pág. 10 del PRD)
            Patient laura = Patient.builder()
                    .internalCode("PSI-PCT-2026-014") // Código oficial del PRD
                    .firstName("Laura")
                    .lastName("Méndez")
                    .birthDate(LocalDate.of(1990, 5, 15)) // 36 años aprox en 2026
                    .occupation("Diseñadora gráfica")
                    .maritalStatus("En pareja")
                    .sex("Femenino")
                    .active(true)
                    .professional(pro) // Vinculada a Claire
                    .build();

            patientRepository.save(laura);

            System.out.println("✅ Datos sembrados: Profesional Claire y Paciente Laura listos.");
        }
    }
}