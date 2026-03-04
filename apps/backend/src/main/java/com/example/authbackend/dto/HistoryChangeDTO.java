package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryChangeDTO {

    private OffsetDateTime changeDate;
    private String previousContent;
    private String newContent;

}
