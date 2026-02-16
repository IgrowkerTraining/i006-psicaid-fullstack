package com.example.authbackend.controller;

import com.example.authbackend.dto.PatientDTO;
import com.example.authbackend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public List<PatientDTO> list() {
        return patientService.getAllPatients();
    }

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        return ResponseEntity.ok(patientService.createPatient(patientDTO));
    }
}