package com.example.authbackend.service;

import com.example.authbackend.dto.HistoryChangeDTO;
import com.example.authbackend.model.HistoryChange;
import com.example.authbackend.repository.HistoryChangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class HistoryChangeService {

    private final HistoryChangeRepository historyChangeRepository;

    public List<HistoryChangeDTO> getHistoryChanges(Long sessionId) {

        return historyChangeRepository.findBySessionId(sessionId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private HistoryChangeDTO convertToDTO(HistoryChange historyChange) {
        return HistoryChangeDTO.builder()
                .changeDate(historyChange.getChangeDate())
                .newContent(historyChange.getNewContent())
                .previousContent(historyChange.getPreviousContent())
                .build();
    }
}
