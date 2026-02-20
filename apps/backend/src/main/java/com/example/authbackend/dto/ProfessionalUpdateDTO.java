package com.example.authbackend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfessionalUpdateDTO {
        @Pattern(regexp = "^(?!\\s*$).+", message = "El nombre no puede estar vacío o contener solo espacios")
        private String firstName;

        @Pattern(regexp = "^(?!\\s*$).+", message = "El apellido no puede estar vacío o contener solo espacios")
        private String lastName;

}
