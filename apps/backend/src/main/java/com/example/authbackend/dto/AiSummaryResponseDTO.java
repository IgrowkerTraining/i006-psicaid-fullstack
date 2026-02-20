package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AiSummaryResponseDTO {

    @JsonProperty("session_id")
    private Long sessionId;

    @JsonProperty("psychologist_id")
    private Long psychologistId;

    private SummaryData summary;

    // --- Clases anidadas para mapear el JSON ---

    @Data
    public static class SummaryData {
        @JsonProperty("main_concern")
        private String mainConcern;

        private ObservationData observations;

        @JsonProperty("action_items")
        private List<String> actionItems;

        @JsonProperty("follow_up")
        private String followUp;
    }

    @Data
    public static class ObservationData {
        private String duration;
        private String improvement;
    }
}