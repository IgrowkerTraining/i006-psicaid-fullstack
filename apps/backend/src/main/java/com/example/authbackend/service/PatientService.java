package com.example.authbackend.service;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.dto.PatientUpdateDTO;
import com.example.authbackend.model.LogCriticality;
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
    private final LogService logService;

    /**
     * Método privado de utilidad para obtener al profesional que ha iniciado sesión.
     */
    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    /**
     * Lista solo los pacientes del profesional autenticado.
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
     * Lista SOLO los pacientes ACTIVOS del profesional autenticado.
     */
    @Transactional(readOnly = true)
    public List<PatientDTO> getActivePatientsByAuthenticatedProfessional() {
        Professional pro = getAuthenticatedProfessional();

        return patientRepository.findByProfessionalIdAndActiveTrue(pro.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un paciente vinculado automáticamente al profesional logueado.
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
                .email(patientDTO.getEmail())
                .phone(patientDTO.getPhone())
                .clinical_history(patientDTO.getClinical_history())
                .reason_consultation(patientDTO.getReason_consultation())
                .sex(patientDTO.getSex())
                .internalCode(generateInternalCode())
                .active(true)
                .professional(pro) // Vínculo obligatorio
                .build();

        Patient savedPatient = patientRepository.save(patient);

        logService.recordLog(
                LogCriticality.MEDIUM,
                "Alta de nuevo paciente. Código Interno: " + savedPatient.getInternalCode(),
                pro
        );

        return convertToDTO(savedPatient);
    }

    /**
     * Actualiza un paciente existente, asegurando que pertenezca al profesional autenticado.
     */
    @Transactional
    public PatientDTO updatePatient(Long patientId, PatientUpdateDTO dto) {
        // Obtenemos quién está haciendo la petición (Seguridad total por Token)
        Professional pro = getAuthenticatedProfessional();

        // Buscamos el paciente por ID
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + patientId));

        // VALIDACIÓN: Verificamos que el paciente sea de este profesional
        if (!patient.getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado. Este paciente no te pertenece.");
        }

        // Actualizamos solo los campos permitidos y enviados (Soporte para PATCH)
        if (dto.getFirstName() != null) patient.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) patient.setLastName(dto.getLastName());
        if (dto.getOccupation() != null) patient.setOccupation(dto.getOccupation());
        if (dto.getBirthDate() != null) patient.setBirthDate(dto.getBirthDate());
        if (dto.getMaritalStatus() != null) patient.setMaritalStatus(dto.getMaritalStatus());
        if (dto.getSex() != null) patient.setSex(dto.getSex());
        if (dto.getReason_consultation() != null) patient.setReason_consultation(dto.getReason_consultation());
        if (dto.getEmail() != null) patient.setEmail(dto.getEmail());
        if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
        if (dto.getClinical_history() != null) patient.setClinical_history(dto.getClinical_history());

        Patient updatedPatient = patientRepository.save(patient);

        logService.recordLog(
                LogCriticality.MEDIUM,
                "Modificación de datos del paciente con ID: " + updatedPatient.getId(),
                pro
        );
        return convertToDTO(updatedPatient);
    }

    /**
     * Archiva (Soft Delete) a un paciente en lugar de borrarlo de la base de datos.
     * Garantiza que no se pierda el historial clínico (Legal/Compliance).
     */
    @Transactional
    public void archivePatient(Long patientId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Professional pro = professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        if (!patient.getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado. No puedes archivar pacientes de otros profesionales.");
        }

        patient.setActive(false);

        logService.recordLog(
                LogCriticality.HIGH,
                "Archivado (Soft Delete) de paciente con ID: " + patient.getId(),
                pro
        );

        patientRepository.save(patient);
    }

    /**
     * Restaura a un paciente que había sido archivado (Soft Delete).
     * Vuelve a aparecer en la lista de pacientes activos.
     */
    @Transactional
    public void restorePatient(Long patientId) {
        // Identificamos al psicólogo por su token
        Professional pro = getAuthenticatedProfessional();

        // Buscamos al paciente
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Verificamos que no intente restaurar el paciente de otro compañero
        if (!patient.getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado. No puedes restaurar pacientes de otros profesionales.");
        }

        patient.setActive(true);

        logService.recordLog(
                LogCriticality.HIGH,
                "Restauración de paciente archivado con ID: " + patient.getId(),
                pro
        );

        patientRepository.save(patient);
    }

    // --- MÉTODOS DE MAPEO ---

    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .clinical_history(patient.getClinical_history())
                .reason_consultation(patient.getReason_consultation())
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