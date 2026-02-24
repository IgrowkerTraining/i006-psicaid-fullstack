package com.example.authbackend.repository;

import com.example.authbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Busca pacientes pertenecientes a un profesional específico.
     * Esto garantiza el cumplimiento del aislamiento total de datos.
     * pasándole el  ID del profesional autenticado, devuelve lista de pacientes asociados a ese profesional.
     */
    List<Patient> findByProfessionalId(Long professionalId);

    // Cuenta los pacientes activos de un profesional
    long countByProfessionalIdAndActiveTrue(Long professionalId);

    // Devuelve solo los pacientes ACTIVOS de un profesional
    List<Patient> findByProfessionalIdAndActiveTrue(Long professionalId);
}