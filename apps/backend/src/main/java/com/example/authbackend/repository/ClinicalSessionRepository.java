package com.example.authbackend.repository;

import com.example.authbackend.model.ClinicalSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface ClinicalSessionRepository extends JpaRepository<ClinicalSession, Long> {

    @Query("SELECT COUNT(s) FROM ClinicalSession s WHERE s.patient.professional.id = :professionalId AND s.sessionDateTime >= :startDate AND s.sessionDateTime <= :endDate")
    long countSessionsByProfessionalAndDateRange(
            @Param("professionalId") Long professionalId,
            @Param("startDate") OffsetDateTime startDate,
            @Param("endDate") OffsetDateTime endDate
    );

    @Query("SELECT s FROM ClinicalSession s WHERE s.patient.professional.id = :professionalId " +
            "AND s.sessionDateTime >= :startOfDay AND s.sessionDateTime < :endOfDay")
    List<ClinicalSession> findByProfessionalAndDate(
            @Param("professionalId") Long professionalId,
            @Param("startOfDay") OffsetDateTime startOfDay,
            @Param("endOfDay") OffsetDateTime endOfDay);

    List<ClinicalSession> findByPatientIdOrderBySessionDateTimeDesc(Long patientId);

    // Busca las próximas 5 sesiones de este profesional, desde 'ahora' hacia el futuro, ordenadas por fecha más cercana.
    List<ClinicalSession> findTop5ByPatientProfessionalIdAndSessionDateTimeGreaterThanEqualOrderBySessionDateTimeAsc(
            Long professionalId, OffsetDateTime now);

    List<ClinicalSession> findByPatientIdAndSessionDateTimeBetweenOrderBySessionDateTimeAsc(
            Long patientId,
            java.time.OffsetDateTime start,
            java.time.OffsetDateTime end
    );
}