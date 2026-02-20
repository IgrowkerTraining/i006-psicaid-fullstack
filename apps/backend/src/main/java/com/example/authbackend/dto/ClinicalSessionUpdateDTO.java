package com.example.authbackend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Builder
public class ClinicalSessionUpdateDTO {
    // Datos de agenda (por si la cita se reprograma)
    private OffsetDateTime sessionDateTime;
    private String sessionType;
    private Integer duration;

    // Campos clínicos (para rellenar durante o después de la sesión)
    private String reasonConsultation;
    private String background;
    private String observations;
    private String hypothesis;
    private String interventions;
    private String clinicalEvolution;
    private String therapeuticGoals;
    private String diagnosticNotes;
}