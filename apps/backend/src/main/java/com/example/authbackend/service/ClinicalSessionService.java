package com.example.authbackend.service;

import com.example.authbackend.dto.ClinicalSessionDTO;
import com.example.authbackend.dto.ClinicalSessionUpdateDTO;
import com.example.authbackend.model.ClinicalSession;
import com.example.authbackend.model.HistoryChange;
import com.example.authbackend.model.LogCriticality;
import com.example.authbackend.model.Patient;
import com.example.authbackend.model.Professional;
import com.example.authbackend.repository.ClinicalSessionRepository;
import com.example.authbackend.repository.HistoryChangeRepository;
import com.example.authbackend.repository.PatientRepository;
import com.example.authbackend.repository.ProfessionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicalSessionService {

    private final ClinicalSessionRepository sessionRepository;
    private final PatientRepository patientRepository;
    private final ProfessionalRepository professionalRepository;
    private final AiIntegrationService aiIntegrationService;
    private final HistoryChangeRepository historyChangeRepository;
    private final LogService logService;

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
        // Comprobamos que no se solapen sesiones
        validateNoOverlappingSessions(pro.getId(), dto.getSessionDateTime(), dto.getDuration(), null);

        // Convertimos el DTO a Entidad
        ClinicalSession session = ClinicalSession.builder()
                .frequency(dto.getFrequency())
                .sessionDateTime(dto.getSessionDateTime())
                .sessionType(dto.getSessionType())
                .duration(dto.getDuration())
                .observations(dto.getObservations())
                .hypothesis(dto.getHypothesis())
                .interventions(dto.getInterventions())
                .clinicalEvolution(dto.getClinicalEvolution())
                .therapeuticGoals(dto.getTherapeuticGoals())
                .diagnosticNotes(dto.getDiagnosticNotes())
                .patient(patient)
                .build();

        ClinicalSession savedSession = sessionRepository.save(session);

        logService.recordLog(
                LogCriticality.MEDIUM,
                "Alta de sesión clínica para el paciente ID: " + patientId,
                pro
        );
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

    private String buildRawNotesForAi(ClinicalSession session) {
        StringBuilder rawNotes = new StringBuilder();

        if (session.getFrequency() != null)
            rawNotes.append("Motivo de consulta: ").append(session.getFrequency()).append(". ");
        if (session.getObservations() != null)
            rawNotes.append("Observaciones: ").append(session.getObservations()).append(". ");
        if (session.getHypothesis() != null)
            rawNotes.append("Hipótesis: ").append(session.getHypothesis()).append(". ");
        if (session.getInterventions() != null)
            rawNotes.append("Intervenciones: ").append(session.getInterventions()).append(". ");
        if (session.getClinicalEvolution() != null)
            rawNotes.append("Evolución: ").append(session.getClinicalEvolution()).append(". ");
        if (session.getDiagnosticNotes() != null)
            rawNotes.append("Diagnóstico: ").append(session.getDiagnosticNotes()).append(". ");

        return rawNotes.toString();
    }

    /**
     * Actualiza una sesión existente (es para rellenar notas de citas previamente agendadas).
     */
    @Transactional
    public ClinicalSessionDTO updateSession(Long patientId, Long sessionId, ClinicalSessionUpdateDTO dto) {
        Professional pro = getAuthenticatedProfessional();
        getValidPatientForProfessional(patientId, pro);

        ClinicalSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sessionId));

        if (!session.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("La sesión no pertenece al paciente indicado en la URL.");
        }

        // Calculamos la fecha y duración (si el DTO trae una nueva la usamos, si no, usamos la vieja)
        OffsetDateTime newStart = dto.getSessionDateTime() != null ? dto.getSessionDateTime() : session.getSessionDateTime();
        Integer newDuration = dto.getDuration() != null ? dto.getDuration() : session.getDuration();

        // Comprobamos que no se solapen sesiones
        validateNoOverlappingSessions(pro.getId(), newStart, newDuration, sessionId);

        // Histórico de cambios:
        // Guardamos el contenido previo.
        String previousContent = buildNarrative(session);

        // Actualizamos solo los campos que no sean nulos
        if (dto.getSessionDateTime() != null) session.setSessionDateTime(dto.getSessionDateTime());
        if (dto.getSessionType() != null) session.setSessionType(dto.getSessionType());
        if (dto.getDuration() != null) session.setDuration(dto.getDuration());
        if (dto.getFrequency() != null) session.setFrequency(dto.getFrequency());
        if (dto.getObservations() != null) session.setObservations(dto.getObservations());
        if (dto.getHypothesis() != null) session.setHypothesis(dto.getHypothesis());
        if (dto.getInterventions() != null) session.setInterventions(dto.getInterventions());
        if (dto.getClinicalEvolution() != null) session.setClinicalEvolution(dto.getClinicalEvolution());
        if (dto.getTherapeuticGoals() != null) session.setTherapeuticGoals(dto.getTherapeuticGoals());
        if (dto.getDiagnosticNotes() != null) session.setDiagnosticNotes(dto.getDiagnosticNotes());
        if (dto.getStatus() != null) session.setStatus(dto.getStatus());
        session.setUpdatedAt(OffsetDateTime.now());

        ClinicalSession updatedSession = sessionRepository.save(session);

        logService.recordLog(
                LogCriticality.MEDIUM,
                "Modificación de sesión clínica ID: " + sessionId + " del paciente ID: " + patientId,
                pro
        );

        // HC: Guardamos el contenido nuevo
        String newContent = buildNarrative(updatedSession);

        // HC: Si cambió algo → registramos auditoría
        if (!previousContent.equals(newContent)) {

            HistoryChange history = HistoryChange.builder()
                    .previousContent(previousContent)
                    .newContent(newContent)
                    .session(updatedSession)
                    .changeDate(OffsetDateTime.now())
                    .build();

            historyChangeRepository.save(history);
        }

        return convertToDTO(updatedSession);
    }

    @Transactional
    public ClinicalSessionDTO generateAndSaveSummary(Long patientId, Long sessionId) {
        Professional pro = getAuthenticatedProfessional();
        ClinicalSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        if (!session.getPatient().getProfessional().getId().equals(pro.getId())) {
            throw new RuntimeException("Acceso denegado. No puedes resumir sesiones de otros profesionales.");
        }

        if (!session.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("La sesión no pertenece al paciente indicado en la URL.");
        }

        // Preparamos el texto crudo para la IA
        String combinedNotes = buildRawNotesForAi(session);

        if (combinedNotes.isBlank()) {
            throw new RuntimeException("No hay suficientes notas clínicas para generar un resumen.");
        }

        // Llamamos al microservicio de Python (FastAPI)
        String generatedSummary = aiIntegrationService.getSessionSummary(pro.getId(), combinedNotes);

        // Guardamos el resumen generado en la base de datos
        session.setSummary(generatedSummary);
        ClinicalSession savedSession = sessionRepository.save(session);

        // Devolvemos el DTO actualizado
        return convertToDTO(savedSession);
    }

    /**
     * Valida que una nueva cita no se solape con otra existente del professional.
     */
    private void validateNoOverlappingSessions(Long professionalId, OffsetDateTime sessionStart, Integer durationMinutes, Long currentSessionId) {
        if (sessionStart == null || durationMinutes == null) return;

        OffsetDateTime sessionEnd = sessionStart.plusMinutes(durationMinutes);

        //Calculamos el inicio y final del dia para filtrar en la BD
        OffsetDateTime startOfDay = sessionStart.toLocalDate().atStartOfDay(sessionStart.getOffset()).toOffsetDateTime();
        OffsetDateTime endOfDay = startOfDay.plusDays(1);

        // Buscamos las sesiones de ese dia para este profesional
        List<ClinicalSession> dailySessions = sessionRepository.findByProfessionalAndDate(professionalId, startOfDay, endOfDay);

        for (ClinicalSession existing : dailySessions) {
            if (currentSessionId != null && existing.getId().equals(currentSessionId)) {
                continue;
            }

            if (existing.getSessionDateTime() == null || existing.getDuration() == null) {
                continue;
            }

            OffsetDateTime existingStart = existing.getSessionDateTime();
            OffsetDateTime existingEnd = existingStart.plusMinutes(existing.getDuration());

            if (sessionStart.isBefore(existingEnd) && sessionEnd.isAfter(existingStart)) {
                throw new RuntimeException("Horario no disponible. Esta cita se solapa con otra sesión programada.");
            }
        }
    }
    // --- MAPEO DE ENTIDAD A DTO ---

    private ClinicalSessionDTO convertToDTO(ClinicalSession session) {
        return ClinicalSessionDTO.builder()
                .id(session.getId())
                .sessionDateTime(session.getSessionDateTime())
                .sessionType(session.getSessionType())
                .duration(session.getDuration())
                .frequency(session.getFrequency())
                .observations(session.getObservations())
                .hypothesis(session.getHypothesis())
                .interventions(session.getInterventions())
                .clinicalEvolution(session.getClinicalEvolution())
                .therapeuticGoals(session.getTherapeuticGoals())
                .diagnosticNotes(session.getDiagnosticNotes())
                .patientId(session.getPatient().getId())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .summary(session.getSummary())
                .status(session.getStatus())
                .build();
    }

    // Metodo helper para unificar el contenido clinico
    private String buildNarrative(ClinicalSession session) {
        return """
                Status: %s
                Observations: %s
                Hypothesis: %s
                Interventions: %s
                Clinical Evolution: %s
                Therapeutic Goals: %s
                Diagnostic Notes: %s
                Summary: %s
                """.formatted(
                    session.getStatus(),
                    session.getObservations(),
                    session.getHypothesis(),
                    session.getInterventions(),
                    session.getClinicalEvolution(),
                    session.getTherapeuticGoals(),
                    session.getDiagnosticNotes(),
                    session.getSummary()
                );
    }
}