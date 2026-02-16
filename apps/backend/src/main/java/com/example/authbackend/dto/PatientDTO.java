package com.example.authbackend.dto;

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
    private Integer id;
    private String internalCode;
    private String firstName;
    private String lastName;
    private String occupation;
    private LocalDate birthDate;
    private String maritalStatus;
    private String sex;
    private Boolean active;

    // Para relacionarlo con el médico (Foreign Key)
    private Integer professionalId;
}