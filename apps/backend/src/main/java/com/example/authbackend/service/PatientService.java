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

    // MÉTODO PARA OBTENER TODOS (GET) ---
    // OJO: Este método es peligroso (Trae todos los pacientes del sistema)
    // Deberíamos borrarlo o protegerlo con @PreAuthorize("hasRole('ADMIN')")
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

    //  MÉTODO PARA CREAR (POST) ---
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
}