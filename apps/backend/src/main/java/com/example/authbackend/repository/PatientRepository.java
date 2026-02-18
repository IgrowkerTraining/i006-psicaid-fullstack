package com.example.authbackend.repository;

import com.example.authbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Capa de acceso a datos para la entidad Patient.
 * El backend es el único punto de entrada hacia la base de datos.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Busca pacientes pertenecientes a un profesional específico.
     * Esto garantiza el cumplimiento de la regla RB-04: Aislamiento total de datos[cite: 69].
     * * @param professionalId ID del profesional autenticado.
     * @return Lista de pacientes asociados a ese profesional[cite: 82, 193].
     */
    List<Patient> findByProfessionalId(Long professionalId);
}