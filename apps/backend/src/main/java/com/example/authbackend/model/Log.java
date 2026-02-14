package com.example.authbackend.model;
import jakarta.persistence.*;
import lombok.*; // Importamos Lombok
import java.util.List;
import java.time.*;


@Entity
@Table(name = "Logs")
@Getter // Genera getters para todos los campos
@Setter // Genera setters para todos los campos
@NoArgsConstructor // Genera el constructor vacío (Obligatorio para JPA)
@AllArgsConstructor // Genera un constructor con todos los argumentos (Útil para tests)
@Builder // Patrón Builder (Opcional, pero muy pro para crear objetos)

public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "criticaly", nullable = false)
    private Criticality criticaly;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime date_time;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "professional_id", nullable = false)
    private Integer professionalId; // integer -> Integer
}



