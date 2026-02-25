import type { Patient } from "@/services/patients.service";

import type { PatientDetailViewModel } from "./types";

const formatDate = (value: string | undefined, fallback: string) => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const calculateAge = (birthDate: string | undefined, fallback: number) => {
  if (!birthDate) {
    return fallback;
  }

  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  );
};

const buildPatientCode = (rawId: string | number | undefined) => {
  if (rawId === undefined || rawId === null || rawId === "") {
    return "PSI-PCT-2026-014";
  }

  const value = String(rawId).trim();
  if (!value) {
    return "PSI-PCT-2026-014";
  }

  if (value.toUpperCase().startsWith("PSI-")) {
    return value;
  }

  return `PSI-PCT-2026-${value.padStart(3, "0")}`;
};

const extractNumericId = (idOrCode: string | number | undefined): number => {
  if (typeof idOrCode === "number") return idOrCode;
  if (!idOrCode) return 0;
  
  // If it's in PSI format, extract the numeric part
  const match = String(idOrCode).match(/PSI-PCT-\d+-(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  // Otherwise try to parse as number
  const parsed = parseInt(String(idOrCode), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const buildPatientDetail = (
  patient?: Patient | null,
  routeId?: string
): PatientDetailViewModel => {
  const fullName = `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim() || "Sin nombre";
  const status =
    typeof patient?.active === "string"
      ? patient.active.toLowerCase() === "true"
        ? "activo"
        : "inactivo"
      : patient?.active === false
        ? "inactivo"
        : "activo";

  const numericId = extractNumericId(patient?.id ?? routeId);

  // TODO BACKEND: Implementar estos campos en el endpoint GET /api/patients/{id}:
  // - city, sessionFrequency, treatmentStartDate
  // - therapistName, specialty, nextSessionDate, lastSessionDate
  // - address, emergencyContact

  return {
    profile: {
      id: buildPatientCode(numericId),
      numericId,
      fullName,
      age: calculateAge(patient?.birthDate, 0),
      birthDate: formatDate(patient?.birthDate, "No disponible"),
      sex: patient?.sex || "No especificado",
      maritalStatus: patient?.maritalStatus || "No especificado",
      occupation: patient?.occupation || "No especificado",
      city: "No disponible", // TODO BACKEND: agregar campo city
      sessionFrequency: "No disponible", // TODO BACKEND: agregar campo sessionFrequency
      treatmentStartDate: "No disponible", // TODO BACKEND: agregar campo treatmentStartDate
      status,
      therapistName: "No asignado", // TODO BACKEND: agregar campo therapistName
      specialty: "No especificada", // TODO BACKEND: agregar campo specialty
      nextSessionDate: "No disponible", // TODO BACKEND: agregar campo nextSessionDate
      lastSessionDate: "No disponible", // TODO BACKEND: agregar campo lastSessionDate
    },
    contact: {
      email: patient?.email || "No disponible",
      phone: patient?.phone || "No disponible",
      address: "No disponible", // TODO BACKEND: agregar campo address
      emergencyContact: "No disponible", // TODO BACKEND: agregar campo emergencyContact
    },
    clinicalHistory: {
      // TODO BACKEND: Implementar endpoint GET /api/patients/{id}/clinical-history
      // con estos campos: reasonForConsultation, diagnosis, relevantHistory,
      // clinicalObservations, clinicalHypothesis, priorSessionEvolution,
      // therapeuticGoals, additionalObservations, interventions[]
      reasonForConsultation: patient?.reasonConsultation || patient?.reason_consultation || "No disponible",
      diagnosis: "No disponible",
      relevantHistory: "No disponible",
      clinicalObservations: "No disponible",
      clinicalHypothesis: "No disponible",
      priorSessionEvolution: "No disponible",
      therapeuticGoals: "No disponible",
      additionalObservations: "No disponible",
      interventions: [],
    },
    sessions: [
      // TODO BACKEND: Las sesiones se cargan desde el endpoint en SessionsTab
      // usando GET /api/patients/{patientId}/sessions
    ],
    aiSummary: {
      // TODO BACKEND: Implementar endpoint GET /api/patients/{id}/ai-summary
      generatedAt: "No disponible",
      confidenceLabel: "No disponible",
      currentState: "No disponible",
      keyPatterns: [],
      recommendations: [],
      nextSessionFocus: [],
      riskFlags: [],
    },
  };
};

