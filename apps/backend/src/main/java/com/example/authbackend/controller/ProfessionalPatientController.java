package com.example.authbackend.controller;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professionals")
@RequiredArgsConstructor
public class ProfessionalPatientController {

    private final PatientService patientService;

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

}