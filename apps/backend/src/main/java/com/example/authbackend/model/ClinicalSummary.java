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
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "date_from")
    private LocalDate dateFrom;

    @Column(name = "date_until")
    private LocalDate dateUntil;

    @Column(name = "generated_at")
    private OffsetDateTime generatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @ToString.Exclude
    private Patient patient;
}
