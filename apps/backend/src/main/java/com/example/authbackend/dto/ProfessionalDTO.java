package com.example.authbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfessionalDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}