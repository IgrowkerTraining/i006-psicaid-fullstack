package com.example.authbackend.service;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.dto.PatientUpdateDTO;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;

    /**
     * Método privado de utilidad para obtener al profesional que ha iniciado sesión.
     * Garantiza el cumplimiento de RF6 - Control de acceso.
     */
    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    /**
     * Lista solo los pacientes del profesional autenticado (RB-04).
     */
    @Transactional(readOnly = true)
    public List<PatientDTO> getPatientsByAuthenticatedProfessional() {
        Professional pro = getAuthenticatedProfessional();
        return patientRepository.findByProfessionalId(pro.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un paciente vinculado automáticamente al profesional logueado (HU1).
     */
    @Transactional
    public PatientDTO createPatient(PatientDTO patientDTO) {
        Professional pro = getAuthenticatedProfessional();

        Patient patient = Patient.builder()
                .firstName(patientDTO.getFirstName())
                .lastName(patientDTO.getLastName())
                .birthDate(patientDTO.getBirthDate())
                .occupation(patientDTO.getOccupation())
                .maritalStatus(patientDTO.getMaritalStatus())
                .sex(patientDTO.getSex())
                .internalCode(generateInternalCode())
                .active(true)
                .professional(pro) // Vínculo obligatorio
                .build();

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    /**
     * Actualiza un paciente existente, asegurando que pertenezca al profesional autenticado.
     */
    @Transactional
    public PatientDTO updatePatient(Long patientId, PatientUpdateDTO dto) {
        // 1. Obtenemos quién está haciendo la petición (Seguridad total por Token)
        Professional pro = getAuthenticatedProfessional();

        // 2. Buscamos el paciente por ID
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + patientId));

        // 3. VALIDACIÓN CRÍTICA (RB-04): Verificamos que el paciente sea de este profesional [cite: 68]
        if (!patient.getProfessional().getId().equals(pro.getId())) {
            // Lanzar una excepción aquí evita fugas de información.
            // En un caso real podríamos lanzar un 403 Forbidden.
            throw new RuntimeException("Acceso denegado. Este paciente no te pertenece.");
        }

        // 4. Actualizamos solo los campos permitidos y enviados (Soporte para PATCH)
        if (dto.getFirstName() != null) patient.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) patient.setLastName(dto.getLastName());
        if (dto.getOccupation() != null) patient.setOccupation(dto.getOccupation());
        if (dto.getBirthDate() != null) patient.setBirthDate(dto.getBirthDate());
        if (dto.getMaritalStatus() != null) patient.setMaritalStatus(dto.getMaritalStatus());
        if (dto.getSex() != null) patient.setSex(dto.getSex());
        if (dto.getActive() != null) patient.setActive(dto.getActive());

        // 5. Guardamos y devolvemos. Al tener ID, Hibernate hace un UPDATE en lugar de un INSERT.
        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    // --- MÉTODOS DE MAPEO ---

    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .internalCode(patient.getInternalCode())
                .birthDate(patient.getBirthDate())
                .occupation(patient.getOccupation())
                .maritalStatus(patient.getMaritalStatus())
                .sex(patient.getSex())
                .active(patient.getActive())
                .professionalId(patient.getProfessional().getId())
                .build();
    }

    private String generateInternalCode() {
        return "PSI-PCT-2026-" + (int)(Math.random() * 1000);
    }
}