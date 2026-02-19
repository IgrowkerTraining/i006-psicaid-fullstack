package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime; // <--- Importante para TIMESTAMPTZ
import java.util.List;

@Entity
@Table(name = "clinical_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_date_time", nullable = false)
    private OffsetDateTime sessionDateTime;

    @Column(name = "session_type")
    private String sessionType; // Ej: "Presencial", "Online"

    private Integer duration; // En minutos

    // --- CAMPOS DE TEXTO LARGO (Narrativa Clínica) ---
    // Usamos columnDefinition = "TEXT" para que Hibernate sepa que no es un VARCHAR(255)

    @Column(name = "reason_consultation", columnDefinition = "TEXT")
    private String reasonConsultation;

    @Column(columnDefinition = "TEXT")
    private String background;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(columnDefinition = "TEXT")
    private String hypothesis;

    @Column(columnDefinition = "TEXT")
    private String interventions;

    @Column(name = "clinical_evolution", columnDefinition = "TEXT")
    private String clinicalEvolution;

    @Column(name = "therapeutic_goals", columnDefinition = "TEXT")
    private String therapeuticGoals;

    @Column(name = "diagnostic_notes", columnDefinition = "TEXT")
    private String diagnosticNotes;

    @Column(columnDefinition = "TEXT")
    private String summary; // Aquí guardaremos la respuesta de la IA

    // --- RELACIONES ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @ToString.Exclude
    private Patient patient;
    @OneToMany(mappedBy = "session", fetch = FetchType.LAZY)
    private List<HistoryChange> historyChanges;

    // --- AUDITORÍA AUTOMÁTICA ---

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
