package com.example.authbackend.controller;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de pacientes.
 * Centraliza las operaciones del RF2 - Gestión de pacientes[cite: 36, 37].
 */
@RestController
@RequestMapping("/api/patients") // Ruta limpia y profesional
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDTO>> listPatients() {
        // El Service obtendrá el profesional autenticado internamente
        return ResponseEntity.ok(patientService.getPatientsByAuthenticatedProfessional());
    }

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@Valid @RequestBody PatientDTO patientDTO) {
        // Añadimos @Valid para activar las validaciones del DTO
        // El Service se encarga de vincular el paciente al profesional correcto [cite: 82, 193]
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatient(patientDTO));
    }
    /*-------te dejo tu clase comentada para que puedas comparar aunque como te digo no se debe poner el {id} dentro de la URL. Culpa mia ;)

    @GetMapping("/{id}/patients")
    public ResponseEntity<List<PatientDTO>> listPatients(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientsByProfessional(id));
    }

    //Checked
    @PostMapping("/{id}/patients")
    public ResponseEntity<PatientDTO> createPatient(
            @PathVariable Long id,
            @RequestBody PatientDTO patientDTO) {

        // Ignoramos el professionalId que venga dentro del DTO (si viene)
        // Usamos el de la URL que es la fuente de verdad en este endpoint
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatient(id, patientDTO));
    }

    @PatchMapping("/{professionalId}/patients/{patientId}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long professionalId,
            @PathVariable Long patientId,
            @RequestBody PatientDTO dto) {

        PatientDTO updatedPatient = patientService.updatePatient(
                professionalId,
                patientId,
                dto
        );

        return ResponseEntity.ok(updatedPatient);
    }

     */
}