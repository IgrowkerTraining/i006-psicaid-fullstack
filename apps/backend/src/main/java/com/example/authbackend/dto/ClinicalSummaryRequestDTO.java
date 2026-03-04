package com.example.authbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ClinicalSummaryRequestDTO {
    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate dateFrom;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate dateUntil;
}
