package com.example.authbackend.controller;

import com.example.authbackend.dto.ClinicalSessionDTO;
import com.example.authbackend.service.ClinicalSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class SessionController {

    private final ClinicalSessionService sessionService;

    /**
     * Endpoint para obtener el historial clínico completo de un paciente.
     */
    @GetMapping("/{patientId}/sessions")
    public ResponseEntity<List<ClinicalSessionDTO>> getPatientSessions(@PathVariable Long patientId) {
        return ResponseEntity.ok(sessionService.getPatientSessions(patientId));
    }

    /**
     * Endpoint para crear una nueva sesión clínica.
     */
    @PostMapping("/{patientId}/sessions")
    public ResponseEntity<ClinicalSessionDTO> createSession(
            @PathVariable Long patientId,
            @Valid @RequestBody ClinicalSessionDTO sessionDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.createSession(patientId, sessionDTO));
    }

    /**
     * Endpoint para generar un resumen de la sesión clínica usando IA (Microservicio Python).
     */
    @PostMapping("/{patientId}/sessions/{sessionId}/summarize")
    public ResponseEntity<ClinicalSessionDTO> generateSessionSummary(
            @PathVariable Long patientId,
            @PathVariable Long sessionId) {

        ClinicalSessionDTO updatedSession = sessionService.generateAndSaveSummary(patientId, sessionId);

        return ResponseEntity.ok(updatedSession);
    }
}