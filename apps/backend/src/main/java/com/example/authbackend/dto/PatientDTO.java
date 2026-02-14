package com.example.authbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Integer id;
    private String internalCode;
    private String firstName;
    private String lastName;
    private String occupation;
    private Boolean active;
    // No incluimos 'professional' ni listas pesadas para que sea rápido
}