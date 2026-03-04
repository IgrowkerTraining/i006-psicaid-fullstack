package com.example.authbackend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
public class ClinicalSummaryDTO {
    private Long id;
    private String content;
    private LocalDate dateFrom;
    private LocalDate dateUntil;
    private OffsetDateTime generatedAt;
    private Long patientId;
}