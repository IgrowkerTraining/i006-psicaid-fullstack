package com.example.authbackend.service;

import com.example.authbackend.dto.ClinicalSummaryDTO;
import com.example.authbackend.model.ClinicalSession;
import com.example.authbackend.model.ClinicalSummary;
import com.example.authbackend.model.LogCriticality;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ClinicalSessionRepository;
import com.example.authbackend.repository.ClinicalSummaryRepository;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicalSummaryService {

    private final ClinicalSummaryRepository summaryRepository;
    private final ClinicalSessionRepository sessionRepository;
    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;
    private final AiIntegrationService aiIntegrationService;
    private final LogService logService;

    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    @Transactional
    public ClinicalSummaryDTO generateHistoricalSummary(Long patientId, LocalDate dateFrom, LocalDate dateUntil) {
        Professional pro = getAuthenticatedProfessional();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        if (!patient.getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado.");
        }

        // Convertimos los LocalDate a OffsetDateTime para buscar en la BD
        OffsetDateTime start = dateFrom.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime end = dateUntil.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        // Buscamos todas las sesiones en ese rango
        List<ClinicalSession> sessions = sessionRepository
                .findByPatientIdAndSessionDateTimeBetweenOrderBySessionDateTimeAsc(patientId, start, end);

        if (sessions.isEmpty()) {
            throw new RuntimeException("No hay sesiones en este rango de fechas para resumir.");
        }

        // Juntamos todas las notas de todas las sesiones
        StringBuilder combinedNotes = new StringBuilder();
        for (ClinicalSession session : sessions) {
            combinedNotes.append("Fecha sesión: ").append(session.getSessionDateTime().toLocalDate()).append(". ");
            if (session.getObservations() != null) combinedNotes.append("Observaciones: ").append(session.getObservations()).append(". ");
            if (session.getClinicalEvolution() != null) combinedNotes.append("Evolución: ").append(session.getClinicalEvolution()).append(". ");
            combinedNotes.append("\n");
        }

        // Llamamos al servicio de IA (Python)
        String generatedSummary = aiIntegrationService.getHistoricalSummary(combinedNotes.toString());

        ClinicalSummary summary = ClinicalSummary.builder()
                .content(generatedSummary)
                .dateFrom(dateFrom)
                .dateUntil(dateUntil)
                .generatedAt(OffsetDateTime.now())
                .patient(patient)
                .build();

        ClinicalSummary savedSummary = summaryRepository.save(summary);

        logService.recordLog(
                LogCriticality.LOW,
                "Resumen histórico generado para paciente ID: " + patientId + " desde " + dateFrom + " hasta " + dateUntil,
                pro
        );

        return ClinicalSummaryDTO.builder()
                .id(savedSummary.getId())
                .content(savedSummary.getContent())
                .dateFrom(savedSummary.getDateFrom())
                .dateUntil(savedSummary.getDateUntil())
                .generatedAt(savedSummary.getGeneratedAt())
                .patientId(savedSummary.getPatient().getId())
                .build();
    }
}