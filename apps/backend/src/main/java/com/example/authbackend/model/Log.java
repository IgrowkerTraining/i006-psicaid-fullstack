package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;

@Entity
@Table(name = "logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "criticality", nullable = false)
    private LogCriticality criticality;

    @CreationTimestamp
    @Column(name = "date_time", nullable = false, updatable = false)
    private OffsetDateTime dateTime;

    @Column(name = "action", columnDefinition = "TEXT", nullable = false)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    @ToString.Exclude
    private Professional professional;
}

