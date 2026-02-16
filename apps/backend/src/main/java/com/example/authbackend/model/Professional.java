package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*; // Importamos Lombok
import java.util.List;

@Entity
@Table(name = "professionals")
@Getter // Genera getters para todos los campos
@Setter // Genera setters para todos los campos
@NoArgsConstructor // Genera el constructor vacío (Obligatorio para JPA)
@AllArgsConstructor // Genera un constructor con todos los argumentos (Útil para tests)
@Builder // Patrón Builder (Opcional, pero muy pro para crear objetos)
public class Professional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Relaciones
    @OneToMany(mappedBy = "professional", fetch = FetchType.LAZY)
    private List<Patient> patients;

    @OneToMany(mappedBy = "professional", fetch = FetchType.LAZY)
    private List<Log> logs;
}
