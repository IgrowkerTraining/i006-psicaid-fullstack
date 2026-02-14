package com.psicaid.example.authbackend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LogCriticalityConverter implements AttributeConverter<LogCriticality, String> {

    @Override
    public String convertToDatabaseColumn(LogCriticality attribute) {
        if (attribute == null) {
            return null;
        }
        // Java -> Base de Datos: Devuelve "bajo", "medio", etc.
        return attribute.getDbValue();
    }

    @Override
    public LogCriticality convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        // Base de Datos -> Java: Busca el Enum correspondiente
        return LogCriticality.fromDbValue(dbData);
    }
}