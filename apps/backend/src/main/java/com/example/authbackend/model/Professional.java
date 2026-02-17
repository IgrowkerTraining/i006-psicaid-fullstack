package com.example.authbackend.model;

import jakarta.persistence.*;
import lombok.*; // Importamos Lombok
import java.util.List;

@Entity
@Table(name = "professionals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Patrón Builder (Opcional, pero muy pro para crear objetos)
public class Professional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
