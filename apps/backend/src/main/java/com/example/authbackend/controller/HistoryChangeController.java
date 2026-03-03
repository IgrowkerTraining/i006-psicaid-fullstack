package com.example.authbackend.controller;

import com.example.authbackend.dto.HistoryChangeDTO;
import com.example.authbackend.service.HistoryChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class HistoryChangeController {
    private final HistoryChangeService historyChangeService;

    @GetMapping("/{patientId}/sessions/{sessionId}/historyChange")
    public ResponseEntity<List<HistoryChangeDTO>> getPatientSessions(
            @PathVariable Long patientId,
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(historyChangeService.getHistoryChanges(sessionId));
    }


}
