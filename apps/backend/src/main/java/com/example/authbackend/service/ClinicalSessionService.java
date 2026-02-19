package com.example.authbackend.service;

import com.example.authbackend.dto.ClinicalSessionDTO;
import com.example.authbackend.model.ClinicalSession;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ClinicalSessionRepository;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicalSessionService {

    private final ClinicalSessionRepository sessionRepository;
    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;

    /**
     * Obtiene el profesional autenticado a través del JWT.
     */
    private Professional getAuthenticatedProfessional() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return professionalRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
    }

    /**
     * Obtiene y valida un paciente asegurando que pertenece al profesional.
     */
    private Patient getValidPatientForProfessional(Long patientId, Professional pro) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        if (!patient.getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado. Este paciente no te pertenece.");
        }
        return patient;
    }

    /**
     * Crea una nueva sesión clínica.
     */
    @Transactional
    public ClinicalSessionDTO createSession(Long patientId, ClinicalSessionDTO dto) {
        Professional pro = getAuthenticatedProfessional();
        Patient patient = getValidPatientForProfessional(patientId, pro);

        // Convertimos el DTO a Entidad
        ClinicalSession session = ClinicalSession.builder()
                .sessionDateTime(dto.getSessionDateTime())
                .sessionType(dto.getSessionType())
                .duration(dto.getDuration())
                .reasonConsultation(dto.getReasonConsultation())
                .background(dto.getBackground())
                .observations(dto.getObservations())
                .hypothesis(dto.getHypothesis())
                .interventions(dto.getInterventions())
                .clinicalEvolution(dto.getClinicalEvolution())
                .therapeuticGoals(dto.getTherapeuticGoals())
                .diagnosticNotes(dto.getDiagnosticNotes())
                .patient(patient)
                .build();

        ClinicalSession savedSession = sessionRepository.save(session);
        return convertToDTO(savedSession);
    }

    /**
     * Lista todas las sesiones de un paciente ordenadas cronológicamente.
     */
    @Transactional(readOnly = true)
    public List<ClinicalSessionDTO> getPatientSessions(Long patientId) {
        Professional pro = getAuthenticatedProfessional();
        // Validamos la seguridad antes de buscar las sesiones
        getValidPatientForProfessional(patientId, pro);

        return sessionRepository.findByPatientIdOrderBySessionDateTimeDesc(patientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // --- MAPEO DE ENTIDAD A DTO ---

    private ClinicalSessionDTO convertToDTO(ClinicalSession session) {
        return ClinicalSessionDTO.builder()
                .id(session.getId())
                .sessionDateTime(session.getSessionDateTime())
                .sessionType(session.getSessionType())
                .duration(session.getDuration())
                .reasonConsultation(session.getReasonConsultation())
                .background(session.getBackground())
                .observations(session.getObservations())
                .hypothesis(session.getHypothesis())
                .interventions(session.getInterventions())
                .clinicalEvolution(session.getClinicalEvolution())
                .therapeuticGoals(session.getTherapeuticGoals())
                .diagnosticNotes(session.getDiagnosticNotes())
                .patientId(session.getPatient().getId())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .build();
    }
}
