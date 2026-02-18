package com.example.authbackend.service;

import com.example.authbackend.dto.PatientDTO;
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
     * Garantiza el cumplimiento de RF6 - Control de acceso[cite: 44, 45].
     */
    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    /**
     * Lista solo los pacientes del profesional autenticado (RB-04)[cite: 67, 68, 69].
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
     * Crea un paciente vinculado automáticamente al profesional logueado (HU1)[cite: 190, 191].
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
                .internalCode(generateInternalCode()) // Lógica según PRD [cite: 214]
                .active(true)
                .professional(pro) // Vínculo obligatorio [cite: 82, 193]
                .build();

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    // --- MÉTODOS DE MAPEO (En una empresa usarías MapStruct, aquí lo hacemos manual para aprender) ---

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
        // Ejemplo simple basado en el formato del PRD: PSI-PCT-2026-XXX [cite: 214]
        return "PSI-PCT-2026-" + (int)(Math.random() * 1000);
    }

    /*------- Aquí igual..... con el @validate ahorramos escribir un método tan largo
       @Transactional
    public PatientDTO updatePatient(Long professionalId, Long patientId, PatientDTO dto) {


        // 1. Validar que el paciente existe
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));

        // 2. Validar que pertenece a este profesional (SEGURIDAD)
        if (!patient.getProfessional().getId().equals(professionalId)) {
            throw new RuntimeException(
                    "Patient with ID " + patientId + " does not belong to professional " + professionalId
            );
        }

        // 3. Actualizar solo los campos permitidos
        if (dto.getFirstName() != null) {
            patient.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            patient.setLastName(dto.getLastName());
        }
//        if (dto.getInternalCode() != null) {
//            patient.setInternalCode(dto.getInternalCode());
//        }
        if (dto.getOccupation() != null) {
            patient.setOccupation(dto.getOccupation());
        }
        if (dto.getBirthDate() != null) {
            patient.setBirthDate(dto.getBirthDate());
        }
        if (dto.getMaritalStatus() != null) {
            patient.setMaritalStatus(dto.getMaritalStatus());
        }
        if (dto.getActive() != null) {
            patient.setActive(dto.getActive());
        }
        if (dto.getSex() != null) {
            patient.setSex(dto.getSex());
        }

        // 4. Guardar los cambios
        Patient updatedPatient = patientRepository.save(patient); //Si el objeto TIENE ID, .save() ACTUALIZA la fila existente

        // 5. Convertir a DTO y devolver
        return convertToDTO(updatedPatient);
    }
     */

}