package com.example.authbackend.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;


@Entity
@Table(name = "clinical_summaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ClinicalSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "content", nullable = false)
    private String content;

    @Column(name = "date_from")
    private LocalDate dateFrom; // date -> LocalDate

    @Column(name = "date_until")
    private LocalDateTime dateUntil;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "patient_id", nullable = false)
    private Integer patientId; // integer (int4) -> Integer
}
