package com.example.authbackend.service;

import com.example.authbackend.dto.AiSummaryRequestDTO;
import com.example.authbackend.dto.AiSummaryResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class AiIntegrationService {

    private final RestClient restClient;

    public AiIntegrationService(@Value("${ai.service.base-url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    /**
     * Llama al microservicio de Python para resumir las notas de una sesión.
     */
    public String getSessionSummary(Long psychologistId, String combinedNotes) {

        // ==========================================
        //  MOCK PARA DESARROLLO LOCAL AISLADO
        // ==========================================
        System.out.println("Enviando notas a IA (Mock): " + combinedNotes);

        // Simulamos la respuesta exacta que nos daría el Python de Adrián
        AiSummaryResponseDTO mockResponse = new AiSummaryResponseDTO();
        mockResponse.setSessionId(999L);
        mockResponse.setPsychologistId(psychologistId);

        AiSummaryResponseDTO.SummaryData data = new AiSummaryResponseDTO.SummaryData();
        data.setMainConcern("Ansiedad generalizada con episodios de insomnio (Generado por Mock)");

        AiSummaryResponseDTO.ObservationData obs = new AiSummaryResponseDTO.ObservationData();
        obs.setDuration("3 meses");
        obs.setImprovement("Mejora con técnicas de respiración");
        data.setObservations(obs);

        data.setActionItems(List.of(
                "Continuar con terapia cognitivo-conductual",
                "Revisar higiene del sueño"
        ));
        data.setFollowUp("Revisar en 2 semanas");

        mockResponse.setSummary(data);

        // Pasamos el mock por nuestro formateador real
        return formatSummaryToString(mockResponse);


        // ==========================================
        //  CÓDIGO REAL DE PRODUCCIÓN
        // ==========================================
        /*
        AiSummaryRequestDTO request = AiSummaryRequestDTO.builder()
                .psychologistId(psychologistId)
                .rawNotes(combinedNotes)
                .build();

        try {
            AiSummaryResponseDTO response = restClient.post()
                    .uri("/api/v1/sessions/summarize")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AiSummaryResponseDTO.class);

            return formatSummaryToString(response);

        } catch (Exception e) {
            System.err.println("Error al conectar con IA: " + e.getMessage());
            return "Error: No se pudo generar el resumen automático.";
        }
        */
    }

    /**
     * Transforma el objeto complejo de la IA en un bloque de texto legible.
     */
    private String formatSummaryToString(AiSummaryResponseDTO response) {
        if (response == null || response.getSummary() == null) {
            return "Resumen no disponible.";
        }

        AiSummaryResponseDTO.SummaryData data = response.getSummary();
        StringBuilder formattedText = new StringBuilder();

        if (data.getMainConcern() != null) {
            formattedText.append("Motivo principal: ").append(data.getMainConcern()).append("\n\n");
        }

        if (data.getObservations() != null) {
            formattedText.append("Observaciones:\n");
            formattedText.append(" - Duración: ").append(data.getObservations().getDuration()).append("\n");
            formattedText.append(" - Evolución: ").append(data.getObservations().getImprovement()).append("\n\n");
        }

        if (data.getActionItems() != null && !data.getActionItems().isEmpty()) {
            formattedText.append("Plan de acción:\n");
            for (String item : data.getActionItems()) {
                formattedText.append(" - ").append(item).append("\n");
            }
            formattedText.append("\n");
        }

        if (data.getFollowUp() != null) {
            formattedText.append("Seguimiento: ").append(data.getFollowUp());
        }

        return formattedText.toString().trim();
    }
}