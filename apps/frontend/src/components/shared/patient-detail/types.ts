export type PatientDetailViewModel = {
  profile: {
    id: string;
    fullName: string;
    age: number;
    birthDate: string;
    sex: string;
    maritalStatus: string;
    occupation: string;
    city: string;
    sessionFrequency: string;
    treatmentStartDate: string;
    status: "activo" | "inactivo";
    therapistName: string;
    specialty: string;
    nextSessionDate: string;
    lastSessionDate: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
  };
  clinicalHistory: {
    reasonForConsultation: string;
    diagnosis: string;
    relevantHistory: string;
    clinicalObservations: string;
    clinicalHypothesis: string;
    priorSessionEvolution: string;
    therapeuticGoals: string;
    additionalObservations: string;
    interventions: string[];
  };
  sessions: Array<{
    id: string;
    date: string;
    durationMinutes: number;
    modality: string;
    status: "completada" | "programada" | "cancelada";
    focus: string;
    highlights: string[];
    tasks: string[];
  }>;
  aiSummary: {
    generatedAt: string;
    confidenceLabel: string;
    currentState: string;
    keyPatterns: string[];
    recommendations: string[];
    nextSessionFocus: string[];
    riskFlags: string[];
  };
};

