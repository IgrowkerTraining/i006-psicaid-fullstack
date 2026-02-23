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

export const buildPatientDetailMock = (
  patient?: Patient | null,
  routeId?: string
): PatientDetailViewModel => {
  const fullName = `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim() || "Laura Mendez";
  const status =
    typeof patient?.active === "string"
      ? patient.active.toLowerCase() === "true"
        ? "activo"
        : "inactivo"
      : patient?.active === false
        ? "inactivo"
        : "activo";

  return {
    profile: {
      id: buildPatientCode(patient?.id ?? routeId),
      fullName,
      age: calculateAge(patient?.birthDate, 36),
      birthDate: formatDate(patient?.birthDate, "14/08/1989"),
      sex: patient?.sex || "Femenino",
      maritalStatus: patient?.maritalStatus || "En pareja",
      occupation: patient?.occupation || "Disenadora grafica",
      city: "Santiago Centro",
      sessionFrequency: "Mensual",
      treatmentStartDate: "15/01/2026",
      status,
      therapistName: "Julian Martinez",
      specialty: "Psicologia",
      nextSessionDate: "10/03/2026 - 18:00",
      lastSessionDate: "10/02/2026 - 18:00",
    },
    contact: {
      phone: "+56 9 4123 8890",
      email: "laura.mendez@email.com",
      address: "Providencia, Santiago",
      emergencyContact: "Camila Rojas (Hermana) - +56 9 7755 2211",
    },
    clinicalHistory: {
      reasonForConsultation:
        "Dificultades para regular ansiedad en contextos laborales y sensacion persistente de autoexigencia elevada.",
      diagnosis:
        "Trastorno de ansiedad generalizada (en evaluacion).",
      relevantHistory:
        "Historia previa de ansiedad generalizada. Tratamiento psicologico intermitente en anos anteriores. Sin tratamiento farmacologico actual.",
      clinicalObservations:
        "La paciente se presenta orientada en tiempo y espacio. Discurso coherente, con tendencia a la rumiacion y anticipacion negativa. Se observa aumento de tension corporal al relatar situaciones laborales. Estado de animo ansioso, con adecuada capacidad reflexiva.",
      clinicalHypothesis:
        "Patron de autoexigencia sostenido, asociado a esquemas de perfeccionismo y dificultad para establecer limites en el ambito profesional.",
      priorSessionEvolution:
        "Se observa leve mejora en la identificacion de senales corporales de ansiedad. Persiste dificultad para modificar conductas evitativas.",
      therapeuticGoals:
        "Reducir intensidad de ansiedad anticipatoria. Fortalecer habilidades de regulacion emocional. Trabajar establecimiento de limites laborales.",
      additionalObservations:
        "La paciente expresa motivacion para continuar el proceso terapeutico. Se acuerda mantener frecuencia mensual y retomar seguimiento de registros emocionales en la proxima sesion.",
      interventions: [
        "Psicoeducacion sobre ansiedad y autoexigencia.",
        "Identificacion de pensamientos automaticos.",
        "Ejercicios de respiracion diafragmatica guiada.",
        "Propuesta de registro emocional entre sesiones.",
      ],
    },
    sessions: [
      {
        id: "SES-021",
        date: "10/02/2026 - 18:00",
        durationMinutes: 50,
        modality: "Teleconsulta",
        status: "completada",
        focus: "Ansiedad anticipatoria vinculada a cierre de proyectos",
        highlights: [
          "Reconocio detonantes asociados a plazos y revision externa.",
          "Reporta menos tension mandibular al aplicar respiracion.",
          "Mayor conciencia de dialogo interno exigente.",
        ],
        tasks: [
          "Registrar episodios de ansiedad 3 veces por semana.",
          "Aplicar pausa de respiracion antes de reuniones criticas.",
        ],
      },
      {
        id: "SES-020",
        date: "13/01/2026 - 18:00",
        durationMinutes: 50,
        modality: "Presencial",
        status: "completada",
        focus: "Mapeo de pensamientos automaticos y exigencias personales",
        highlights: [
          "Identifico patron de 'si no es perfecto, esta mal'.",
          "Relaciona aumento de ansiedad con dificultad para delegar.",
        ],
        tasks: [
          "Completar registro ABC de situaciones laborales.",
          "Practicar reformulacion de pensamiento 1 vez al dia.",
        ],
      },
      {
        id: "SES-022",
        date: "10/03/2026 - 18:00",
        durationMinutes: 50,
        modality: "Teleconsulta",
        status: "programada",
        focus: "Seguimiento de limites laborales y exposicion gradual",
        highlights: [
          "Sesion pendiente.",
        ],
        tasks: [
          "Llegar con registro emocional actualizado.",
        ],
      },
    ],
    aiSummary: {
      generatedAt: "22/02/2026 - 09:45",
      confidenceLabel: "Confianza media-alta",
      currentState:
        "Se mantiene sintomatologia ansiosa de base, con progresos iniciales en conciencia corporal y deteccion de pensamientos automaticos.",
      keyPatterns: [
        "Rumiacion posterior a reuniones con feedback.",
        "Autoevaluacion rigida ante errores menores.",
        "Evitacion de conversaciones de limites en periodos de alta demanda.",
      ],
      recommendations: [
        "Profundizar reestructuracion cognitiva sobre perfeccionismo.",
        "Introducir plan de exposicion para conversaciones laborales dificiles.",
        "Mantener monitoreo somatico breve al inicio y cierre del dia.",
      ],
      nextSessionFocus: [
        "Revisar registros emocionales y detectar avances medibles.",
        "Entrenar guion de comunicacion asertiva.",
        "Definir indicador semanal de carga percibida.",
      ],
      riskFlags: [
        "Sin indicadores de riesgo agudo reportados.",
        "Vigilar incremento de insomnio en semanas de alta carga laboral.",
      ],
    },
  };
};

