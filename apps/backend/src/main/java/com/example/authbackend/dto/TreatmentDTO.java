package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreatmentDTO {
    // access = READ_ONLY evita que el cliente los envíe en el POST/PUT
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(message = "El contenido del tratamiento no puede estar vacío")
    private String content;

    @NotNull(message = "La fecha es requerida")
    private LocalDate date;

    //El id del paciente ya esta en el URL.
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long patientId;
}
