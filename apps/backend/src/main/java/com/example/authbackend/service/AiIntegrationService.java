package com.example.authbackend.service;

import com.example.authbackend.dto.AiChatRequestDTO;
import com.example.authbackend.dto.AiChatResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class AiIntegrationService {

    private final RestClient restClient;

    public AiIntegrationService(@Value("${ai.service.base-url}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }

    // ========================================================================
    // CASO 1: RESUMEN DE UNA SOLA SESIÓN
    // ========================================================================
    public String getSingleSessionSummary(Long psychologistId, String notes) {
        String prompt = "Por favor, analiza las siguientes notas de una ÚNICA sesión clínica y extrae la información solicitada: " + notes;
        return callChatApi(prompt, "Error: No se pudo generar el resumen de la sesión.");
    }

    // ========================================================================
    // CASO 2: RESUMEN HISTÓRICO POR FECHAS
    // ========================================================================
    public String getHistoricalSummary(String combinedNotes) {
        String prompt = "Por favor, analiza el siguiente HISTORIAL de notas clínicas acumuladas de varias sesiones y genera una memoria clínica unificada de la evolución: " + combinedNotes;
        return callChatApi(prompt, "Error: No se pudo generar la memoria clínica.");
    }

    // ========================================================================
    // MOTOR CENTRAL QUE SE COMUNICA CON PYTHON (chat.py)
    // ========================================================================
    private String callChatApi(String content, String errorMessage) {
        // 1. Montamos el mensaje del usuario
        AiChatRequestDTO.Message userMessage = AiChatRequestDTO.Message.builder()
                .role("user")
                .content(content)
                .build();

        // 2. Montamos el Body completo
        AiChatRequestDTO request = AiChatRequestDTO.builder()
                .model("openai/gpt-4o-mini")
                .messages(List.of(userMessage))
                .build();

        try {
            // 3. Disparamos a la única ruta válida de Python
            AiChatResponseDTO response = restClient.post()
                    .uri("/api/v1/chat/summary")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AiChatResponseDTO.class);

            return formatResponseToString(response);

        } catch (Exception e) {
            System.err.println("Error al conectar con IA: " + e.getMessage());
            return errorMessage + " Detalles: " + e.getMessage();
        }
    }

    /**
     * Pasa el JSON estricto a un texto bonito para el Frontend,
     * ocultando automáticamente los campos que la IA marca como desconocidos.
     */
    private String formatResponseToString(AiChatResponseDTO response) {
        if (response == null) return "Memoria clínica no disponible.";
        StringBuilder sb = new StringBuilder();

        appendIfValid(sb, "Paciente: ", response.getPaciente());
        appendIfValid(sb, "Edad: ", response.getEdad());
        appendIfValid(sb, "Frecuencia: ", response.getFrecuenciaSesiones());
        appendIfValid(sb, "Última sesión: ", response.getUltimaSesion());
        appendIfValid(sb, "Motivo de consulta:\n", response.getMotivoConsulta());
        appendIfValid(sb, "Contexto clínico:\n", response.getContextoClinico());
        appendIfValid(sb, "Hipótesis de trabajo:\n", response.getHipotesisTrabajo());
        appendIfValid(sb, "Intervenciones:\n", response.getIntervenciones());
        appendIfValid(sb, "Evolución:\n", response.getEvolucion());
        appendIfValid(sb, "Objetivos:\n", response.getObjetivos());
        appendIfValid(sb, "Próxima sesión:\n", response.getProximaSesion());

        return sb.toString().trim();
    }

    /**
     * Filtro inteligente anti-basura.
     */
    private void appendIfValid(StringBuilder sb, String label, String value) {
        if (value != null && !value.trim().isEmpty()) {
            String lower = value.toLowerCase();
            if (!lower.contains("desconocid") && !lower.contains("no especificad") && !lower.contains("no mencionad") && !lower.equals("null")) {
                sb.append(label).append(value).append("\n\n");
            }
        }
    }
}