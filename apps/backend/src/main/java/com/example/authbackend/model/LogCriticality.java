package com.example.authbackend.model;

import lombok.Getter;

@Getter
public enum LogCriticality {
    // Definimos los valores de Java (Mayúsculas) y su equivalente en BD (Minúsculas)
    LOW("bajo"),
    MEDIUM("medio"),
    HIGH("alto"),
    CRITICAL("critico");

    private final String dbValue;

    LogCriticality(String dbValue) {
        this.dbValue = dbValue;
    }

    // Método helper para convertir de Texto BD -> Enum Java
    public static LogCriticality fromDbValue(String text) {
        for (LogCriticality b : LogCriticality.values()) {
            if (b.dbValue.equalsIgnoreCase(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Valor de criticidad desconocido: " + text);
    }
}