package com.example.authbackend.service;

import com.example.authbackend.dto.TreatmentDTO;
import com.example.authbackend.model.Professional;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Treatment;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import com.example.authbackend.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreatmentService {

    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;
    private final TreatmentRepository treatmentRepository;

    //Obtener el profesional autenticado.
    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    // Obtener todos los tratamientos de un paciente
    @Transactional(readOnly = true)
    public List<TreatmentDTO> getTreatmentsByPatient(Long patientId){

        // Validar que el paciente existe
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException(
                        "No se encuentra el paciente de ID: " + patientId
                ));

        //Validar que el paciente pertenece al profesional autenticado.
        Professional professional = getAuthenticatedProfessional();
        if(!professional.getId().equals(patient.getProfessional().getId())){
            throw new RuntimeException(
                    "Acceso denegado al paciente de ID: " + patientId
            );
        }

        //Obtener los tratamientos del paciente. Aprovechamos la relacion @oneToMany,
        List<Treatment> treatments = patient.getTreatments();

        //Convertir a DTO los elementos de la lista.
        return treatments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    @Transactional
    public TreatmentDTO createTreatment(Long patientId, TreatmentDTO treatmentDTO) {
        // Validar que el paciente existe
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException(
                        "No se encuentra el paciente de ID: " + patientId
                ));

        //Validar que el paciente pertenece al profesional autenticado.
        Professional professional = getAuthenticatedProfessional();
        if(!professional.getId().equals(patient.getProfessional().getId())){
            throw new RuntimeException(
                    "Acceso denegado al paciente de ID: " + patientId
            );
        }

        //Crear la entidad treatment con los datos ingresados.
        Treatment treatment = Treatment.builder()
                .content(treatmentDTO.getContent())
                .date(treatmentDTO.getDate()) //El front debe enviar la fecha de hoy
                .patient(patient)
                .build();

        //Guardar la entidad treatment.
        Treatment savedTreatment = treatmentRepository.save(treatment);

        //Convertir a DTO.
        return convertToDTO(savedTreatment);
    }

    //Convertir Treatment --> DTO.
    private TreatmentDTO convertToDTO(Treatment treatment) {
        return TreatmentDTO.builder()
                .id(treatment.getId())
                .content(treatment.getContent())
                .date(treatment.getDate())
                .patientId(treatment.getPatient().getId())
                .build();
    }

}
