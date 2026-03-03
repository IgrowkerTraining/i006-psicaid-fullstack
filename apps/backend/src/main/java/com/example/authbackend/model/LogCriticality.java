package com.example.authbackend.model;

import lombok.Getter;

@Getter
public enum LogCriticality {
    // Definimos los valores de Java (Mayúsculas) y su equivalente en BD (Minúsculas)
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high");

    private final String dbValue;

    LogCriticality(String dbValue) {
        this.dbValue = dbValue;
    }

    // Metodo helper para convertir de Texto BD -> Enum Java
    public static LogCriticality fromDbValue(String text) {
        for (LogCriticality b : LogCriticality.values()) {
            if (b.dbValue.equalsIgnoreCase(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Valor de criticidad desconocido: " + text);
    }
}