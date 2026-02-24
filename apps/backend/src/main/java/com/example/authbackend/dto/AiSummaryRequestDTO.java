package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiSummaryRequestDTO {

    @JsonProperty("psychologist_id")
    private Long psychologistId;

    @JsonProperty("raw_notes")
    private String rawNotes;
}