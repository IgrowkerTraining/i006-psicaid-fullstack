package com.example.authbackend.service;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.model.Patient;
import com.example.authbackend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Inyecta el repositorio automáticamente
public class PatientService {

    private final PatientRepository patientRepository;

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Método helper para transformar de Entity a DTO
    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .internalCode(patient.getInternalCode())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .occupation(patient.getOccupation())
                .active(patient.getActive())
                .build();
    }
}