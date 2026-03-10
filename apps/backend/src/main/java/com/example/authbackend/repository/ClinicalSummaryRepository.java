package com.example.authbackend.repository;

import com.example.authbackend.model.ClinicalSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalSummaryRepository extends JpaRepository<ClinicalSummary, Long> {
    // Busca los resúmenes de un paciente específico ordenados por fecha de generación (más recientes primero)
    Page<ClinicalSummary> findByPatientIdOrderByGeneratedAtDesc(Long patientId, Pageable pageable);
}