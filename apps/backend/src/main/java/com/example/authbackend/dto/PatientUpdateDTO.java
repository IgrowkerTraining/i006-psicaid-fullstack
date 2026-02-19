package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO específico para actualizaciones parciales (PATCH).
 * Ningún campo es obligatorio (@NotBlank/@NotNull), permitiendo actualizar
 * solo lo que el usuario envíe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientUpdateDTO {
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String occupation;
    private String maritalStatus;
    private String sex;
    private Boolean active;
}