package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
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

    @Column(name = "internal_code")
    private String internalCode;

    // --- COINCIDENCIA EXACTA CON TU CAPTURA ---
    @Column(name = "first_name", nullable = false)
    private String firstName; // Mapea a first_name

    @Column(name = "last_name", nullable = false)
    private String lastName;  // Mapea a last_name
    // ------------------------------------------

    // Nota: En tu captura tienes "birthday" Y "birth_date".
    // Usaremos birth_date que es el estándar que creó Hibernate.
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(nullable = true)
    private String occupation;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(nullable = true)
    private String sex;

    // Campo vital para borrado lógico (Soft Delete)
    @Column(name = "active")
    private Boolean active;

    // --- RELACIONES ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    @ToString.Exclude
    private Professional professional;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClinicalSession> clinicalSessions;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Treatment> treatments;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClinicalSummary> clinicalSummaries;

    // --- AUDITORÍA ---
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}