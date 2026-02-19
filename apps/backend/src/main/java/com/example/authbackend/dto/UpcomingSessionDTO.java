package com.example.authbackend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class UpcomingSessionDTO {
    private Long sessionId;
    private Long patientId;
    private String patientFullName;
    private OffsetDateTime sessionDateTime;
}