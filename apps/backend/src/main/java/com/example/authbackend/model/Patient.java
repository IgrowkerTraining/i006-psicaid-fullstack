package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // "unique = true" ayuda a que Hibernate valide, aunque la DB ya tiene la restricción
    @Column(name = "internal_code", nullable = false, unique = true)
    private String internalCode;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate; // JPA lo mapea automáticamente a DATE de SQL

    private String occupation;

    @Column(name = "marital_status")
    private String maritalStatus;

    private String sex;

    // Inicializamos en true por defecto para evitar nulos
    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    // --- RELACIONES ---

    // Muchos Pacientes pertenecen a UN Profesional
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    @ToString.Exclude // <--- ¡VITAL! Evita el bucle infinito
    private Professional professional;
    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClinicalSession> clinicalSessions;
    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Treatment> treatments;
    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClinicalSummary> clinicalSummaries;

    // --- AUDITORÍA AUTOMÁTICA ---
    // Hibernate llenará esto solo, sin que tú tengas que hacer setCreatedAt(now)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}