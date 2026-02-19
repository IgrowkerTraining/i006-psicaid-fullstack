package com.example.authbackend.service;

import com.example.authbackend.dto.DashboardStatsDTO;
import com.example.authbackend.dto.UpcomingSessionDTO;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ClinicalSessionRepository;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final ClinicalSessionRepository sessionRepository;
    private final ProfessionalRepository professionalRepository;

    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getProfessionalStats() {
        Professional pro = getAuthenticatedProfessional();
        Long proId = pro.getId();

        // Calcular fechas de referencia (Usamos UTC para estandarizar)
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        OffsetDateTime startOfToday = now.withHour(0).withMinute(0).withSecond(0);
        OffsetDateTime endOfToday = startOfToday.plusDays(1).minusNanos(1);

        OffsetDateTime startOfWeek = startOfToday.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        OffsetDateTime endOfWeek = startOfWeek.plusDays(7).minusNanos(1);

        OffsetDateTime startOfMonth = startOfToday.with(TemporalAdjusters.firstDayOfMonth());
        OffsetDateTime endOfMonth = startOfToday.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1).minusNanos(1);

        // Realizar las consultas
        long totalPatients = patientRepository.countByProfessionalIdAndActiveTrue(proId);
        long today = sessionRepository.countSessionsByProfessionalAndDateRange(proId, startOfToday, endOfToday);
        long thisWeek = sessionRepository.countSessionsByProfessionalAndDateRange(proId, startOfWeek, endOfWeek);
        long thisMonth = sessionRepository.countSessionsByProfessionalAndDateRange(proId, startOfMonth, endOfMonth);

        //  Buscar las próximas sesiones
        List<UpcomingSessionDTO> upcomingSessions = sessionRepository
                .findTop5ByPatientProfessionalIdAndSessionDateTimeGreaterThanEqualOrderBySessionDateTimeAsc(proId, now)
                .stream()
                .map(session -> UpcomingSessionDTO.builder()
                        .sessionId(session.getId())
                        .patientId(session.getPatient().getId())
                        .patientFullName(session.getPatient().getFirstName() + " " + session.getPatient().getLastName())
                        .sessionDateTime(session.getSessionDateTime())
                        .build())
                .toList();

        // Devolver el DTO ensamblado
        return DashboardStatsDTO.builder()
                .totalActivePatients(totalPatients)
                .sessionsToday(today)
                .sessionsThisWeek(thisWeek)
                .sessionsThisMonth(thisMonth)
                .upcomingSessions(upcomingSessions)
                .build();
    }
}