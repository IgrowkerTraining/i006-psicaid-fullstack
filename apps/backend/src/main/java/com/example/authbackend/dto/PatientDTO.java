package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {

    // access = READ_ONLY evita que el cliente los envíe en el POST/PUT
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String internalCode;

    // --- Validaciones de Entrada ---

    @NotBlank(message = "El nombre del paciente es obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido del paciente es obligatorio")
    private String lastName;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate birthDate;

    // Estos pueden ser opcionales según el caso, pero los dejamos sin validación estricta
    // por si el psicólogo no los tiene en la primera sesión
    private String occupation;
    private String maritalStatus;
    private String sex;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean active;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long professionalId;
}