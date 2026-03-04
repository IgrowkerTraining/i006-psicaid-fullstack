package com.example.authbackend.repository;

import com.example.authbackend.model.ClinicalSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalSummaryRepository extends JpaRepository<ClinicalSummary, Long> {
    List<ClinicalSummary> findByPatientIdOrderByGeneratedAtDesc(Long patientId);
}