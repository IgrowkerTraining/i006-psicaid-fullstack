package com.example.authbackend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsDTO {
    private long sessionsToday;
    private long sessionsThisWeek;
    private long totalActivePatients;
    private long sessionsThisMonth;

    private List<UpcomingSessionDTO> upcomingSessions;
}