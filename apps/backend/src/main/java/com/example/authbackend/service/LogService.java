package com.example.authbackend.service;

import com.example.authbackend.model.Log;
import com.example.authbackend.model.LogCriticality;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    /**
     * Guarda un registro en la tabla de logs de manera independiente.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordLog(LogCriticality criticality, String action, Professional professional) {
        Log log = Log.builder()
                .criticality(criticality)
                .action(action)
                .professional(professional)
                .dateTime(OffsetDateTime.now())
                .build();

        logRepository.save(log);
    }
}