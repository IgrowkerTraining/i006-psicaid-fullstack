package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "history_changes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // "change_date" es timestamptz en Supabase -> OffsetDateTime en Java
    // Usamos @CreationTimestamp para que se guarde la fecha exacta del insert automáticamente
    @CreationTimestamp
    @Column(name = "change_date", nullable = false, updatable = false)
    private OffsetDateTime changeDate;

    // --- CAMPOS DE AUDITORÍA ---

    @Column(name = "previous_content", columnDefinition = "TEXT")
    private String previousContent;

    @Column(name = "new_content", columnDefinition = "TEXT")
    private String newContent;

    // --- RELACIONES ---

    // Muchas auditorías pertenecen a UNA Sesión
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @ToString.Exclude // Evitamos bucle infinito
    private ClinicalSession session;
}
