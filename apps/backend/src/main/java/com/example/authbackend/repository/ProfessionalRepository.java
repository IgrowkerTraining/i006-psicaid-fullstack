package com.example.authbackend.repository;

import com.example.authbackend.model.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {

    // Metodo mágico: Spring crea el SQL automáticamente al leer el nombre del metodo
    Optional<Professional> findByEmail(String email);

    // Para verificar si existe antes de registrar
    boolean existsByEmail(String email);
}