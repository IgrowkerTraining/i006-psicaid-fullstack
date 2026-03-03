package com.example.authbackend.service;

import com.example.authbackend.dto.ProfessionalDTO;
import com.example.authbackend.dto.ProfessionalUpdateDTO;
import com.example.authbackend.model.LogCriticality;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;
    private final LogService logService;

    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    @Transactional
    public ProfessionalDTO updateProfessional(
            ProfessionalUpdateDTO dto) {

        // Obtenemos quién está haciendo la petición.
        Professional profesionalAuth = getAuthenticatedProfessional();

        //Actualizamos solo los campos permitidos y enviados.
        if (dto.getFirstName() != null) profesionalAuth.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) profesionalAuth.setLastName(dto.getLastName());

        Professional updatedProfessional = professionalRepository.save(profesionalAuth);

        logService.recordLog(
                LogCriticality.LOW,
                "Modificación del perfil del profesional ID: " + updatedProfessional.getId(),
                updatedProfessional
        );
        return convertToDTO(updatedProfessional);
    }
    /**
     * Obtiene los datos del profesional logueado.
     */
    public ProfessionalDTO getProfessionalByEmail(String email) {
        Professional professional = professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado en la base de datos"));

        return ProfessionalDTO.builder()
                .id(professional.getId())
                .firstName(professional.getFirstName())
                .lastName(professional.getLastName())
                .email(professional.getEmail())
                .build();
    }

    private ProfessionalDTO convertToDTO(Professional professional) {
        return ProfessionalDTO.builder()
                .id(professional.getId())
                .firstName(professional.getFirstName())
                .lastName(professional.getLastName())
                .email(professional.getEmail())
                .build();
    }

}
