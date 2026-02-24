package com.example.authbackend.controller;

import com.example.authbackend.dto.TreatmentDTO;
import com.example.authbackend.service.TreatmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/")
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentService treatmentService;

    @GetMapping("/{patientId}/treatments")
    public ResponseEntity<List<TreatmentDTO>> getPatientTreatment(@PathVariable Long patientId) {

        return ResponseEntity.ok(treatmentService.getTreatmentsByPatient(patientId));
    }

    @PostMapping("/{patientId}/treatments")
    public ResponseEntity<TreatmentDTO> createTreatment(
            @PathVariable Long patientId,
            @Valid @RequestBody TreatmentDTO treatmentDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(treatmentService.createTreatment(patientId, treatmentDTO));
    }
}
