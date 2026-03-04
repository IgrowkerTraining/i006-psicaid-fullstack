package com.example.authbackend.controller;

import com.example.authbackend.dto.ClinicalSessionDTO;
import com.example.authbackend.dto.ClinicalSessionUpdateDTO;
import com.example.authbackend.dto.ClinicalSummaryDTO;
import com.example.authbackend.model.ClinicalSummary;
import com.example.authbackend.service.ClinicalSessionService;
import com.example.authbackend.service.ClinicalSummaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// IMPORTACIONES NUEVAS AÑADIDAS
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class SessionController {

    private final ClinicalSessionService sessionService;
    private final ClinicalSummaryService clinicalSummaryService;

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
     * Endpoint para actualizar una sesión existente (añadir notas clínicas a una cita agendada).
     */
    @PatchMapping("/{patientId}/sessions/{sessionId}")
    public ResponseEntity<ClinicalSessionDTO> updateSession(
            @PathVariable Long patientId,
            @PathVariable Long sessionId,
            @RequestBody ClinicalSessionUpdateDTO updateDTO) {

        ClinicalSessionDTO updatedSession = sessionService.updateSession(patientId, sessionId, updateDTO);
        return ResponseEntity.ok(updatedSession);
    }

    /**
     * Endpoint para generar un resumen de la sesión clínica usando IA (Microservicio Python).
     */
    @PostMapping("/{patientId}/sessions/{sessionId}/summarize")
    public ResponseEntity<Map<String, String>> generateSessionSummary(
            @PathVariable Long patientId,
            @PathVariable Long sessionId) {

        // Ejecutamos la lógica en el servicio (guarda en BD y contacta con IA)
        ClinicalSessionDTO updatedSession = sessionService.generateAndSaveSummary(patientId, sessionId);

        // Extraemos solo el resumen y creamos el mapa para la respuesta JSON
        Map<String, String> response = new HashMap<>();
        response.put("summary", updatedSession.getSummary());

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para generar un resumen HISTÓRICO de varias sesiones entre dos fechas.
     */
    @PostMapping("/{patientId}/summaries/historical")
    public ResponseEntity<ClinicalSummaryDTO> generateHistoricalSummary(
            @PathVariable Long patientId,
            @Valid @RequestBody com.example.authbackend.dto.ClinicalSummaryRequestDTO requestDTO) {

        ClinicalSummaryDTO summary = clinicalSummaryService.generateHistoricalSummary(
                patientId,
                requestDTO.getDateFrom(),
                requestDTO.getDateUntil()
        );

        return ResponseEntity.ok(summary);
    }
}