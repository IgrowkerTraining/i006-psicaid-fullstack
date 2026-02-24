package com.example.authbackend.controller;

import com.example.authbackend.dto.ProfessionalDTO;
import com.example.authbackend.dto.ProfessionalUpdateDTO;
import com.example.authbackend.service.ProfessionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/myprofile")
@RequiredArgsConstructor
public class ProfessionalController {
    private final ProfessionalService professionalService;

    @PatchMapping("/edit")
    public ResponseEntity<ProfessionalDTO> updateProfessional(
            @Valid @RequestBody ProfessionalUpdateDTO dto) {

        return ResponseEntity.ok(professionalService.updateProfessional(dto));
    }
}
