package com.example.authbackend.repository;

import com.example.authbackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Esto busca en nombre O apellido, ignorando mayúsculas y minúsculas.
    @Query("SELECT p FROM Patient p WHERE " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Patient> searchByName(@Param("keyword") String keyword);

    // Método extra para filtrar por estado
    List<Patient> findByActiveTrue();

    List<Patient> findByProfessionalId(Long professionalId);
}