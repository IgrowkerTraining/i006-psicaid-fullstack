package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalSessionDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    // --- Metadatos de la sesión ---
    @NotNull(message = "La fecha y hora de la sesión es obligatoria")
    private OffsetDateTime sessionDateTime;

    private String sessionType; // Ej: Individual presencial

    private Integer duration; // En minutos

    // --- Narrativa Clínica (Textos libres permitidos por HU2) ---
    private String reasonConsultation;
    private String background;
    private String observations;
    private String hypothesis;
    private String interventions;
    private String clinicalEvolution;
    private String therapeuticGoals;
    private String diagnosticNotes;

    // Relación de entrada
    @NotNull(message = "El ID del paciente es obligatorio")
    private Long patientId;

    // --- Auditoría Automática (Solo lectura) ---
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime updatedAt;
}