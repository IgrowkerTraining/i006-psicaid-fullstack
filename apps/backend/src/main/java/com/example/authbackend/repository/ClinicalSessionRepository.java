package com.example.authbackend.repository;

import com.example.authbackend.model.ClinicalSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicalSessionRepository extends JpaRepository<ClinicalSession, Long> {

    List<ClinicalSession> findByPatientIdOrderBySessionDateTimeDesc(Long patientId);
}