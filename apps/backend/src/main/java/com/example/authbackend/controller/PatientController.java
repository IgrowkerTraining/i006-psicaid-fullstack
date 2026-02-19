package com.example.authbackend.controller;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.dto.PatientUpdateDTO;
import com.example.authbackend.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de pacientes.
 * Centraliza las operaciones de gestión de pacientes.
 */
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> listPatients() {
        // Obtenemos los pacientes asegurando el aislamiento de datos
        return ResponseEntity.ok(patientService.getPatientsByAuthenticatedProfessional());
    }

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@Valid @RequestBody PatientDTO patientDTO) {
        // @Valid activa las restricciones del DTO.
        // El paciente se asocia de forma única al profesional autenticado
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatient(patientDTO));
    }

    @PatchMapping("/{patientId}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long patientId,
            @Valid @RequestBody PatientUpdateDTO dto) {

        // El Service se encargará de verificar que el patientId le pertenece al usuario actual antes de actualizar.
        return ResponseEntity.ok(patientService.updatePatient(patientId, dto));
    }
}