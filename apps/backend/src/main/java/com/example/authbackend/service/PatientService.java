package com.example.authbackend.service;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional; // Asegúrate de tener este modelo
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository; // Necesitas este repo
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;

    // MeTODO PARA OBTENER TODOS (GET) ---
    // OJO: Este metodo es peligroso (Trae todos los pacientes del sistema)
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Listar SOLO los pacientes de un médico específico
    @Transactional(readOnly = true)
    public List<PatientDTO> getPatientsByProfessional(Long professionalId) { // CAMBIO: Integer -> Long

        // CAMBIO: Eliminamos Long.valueOf() porque ya recibimos un Long
        return patientRepository.findByProfessionalId(professionalId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //  MeTODO PARA CREAR (POST) ---
    @Transactional
    public PatientDTO createPatient(Long professionalId, PatientDTO dto) {

        // Validamos que el médico existe
        Professional professional = professionalRepository.findById(professionalId)
                .orElseThrow(() -> new RuntimeException("Professional not found with ID: " + professionalId));

        // Mapear DTO a Entidad
        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setInternalCode(dto.getInternalCode());
        patient.setOccupation(dto.getOccupation());
        patient.setBirthDate(dto.getBirthDate());
        patient.setSex(dto.getSex());
        patient.setMaritalStatus(dto.getMaritalStatus());

        patient.setActive(true); // Regla de negocio: Nace activo
        patient.setProfessional(professional); // Vinculación

        // Guardar y devolver convertido
        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    // --- MÉTODOS AUXILIARES ---
    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .internalCode(patient.getInternalCode())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .occupation(patient.getOccupation())
                .active(patient.getActive())
                .birthDate(patient.getBirthDate())
                .maritalStatus(patient.getMaritalStatus())
                .sex(patient.getSex())
                .professionalId(patient.getProfessional() != null ? patient.getProfessional().getId() : null)
                .build();
    }

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


}