package com.example.authbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiChatResponseDTO {
    private String paciente;
    private String edad;
    @JsonProperty("frecuencia_sesiones")
    private String frecuenciaSesiones;
    @JsonProperty("ultima_sesion")
    private String ultimaSesion;
    @JsonProperty("motivo_consulta")
    private String motivoConsulta;
    @JsonProperty("contexto_clinico")
    private String contextoClinico;
    @JsonProperty("hipotesis_trabajo")
    private String hipotesisTrabajo;
    private String intervenciones;
    private String evolucion;
    private String objetivos;
    @JsonProperty("proxima_sesion")
    private String proximaSesion;
}