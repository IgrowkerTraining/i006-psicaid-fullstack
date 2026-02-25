import type { Patient } from "@/services/patients.service";
import type { PatientResult } from "@/components/shared/patients/PatientResultCard";

export const mapPatientToCard = (patient: Patient): PatientResult => {
  const fullName = `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim();
  const birthDate = patient.birthDate ? new Date(patient.birthDate) : null;
  const normalizedActive =
    typeof patient.active === "string"
      ? patient.active.toLowerCase() === "true"
      : patient.active ?? true;

  const calculatedAge =
    birthDate && !Number.isNaN(birthDate.getTime())
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          )
        )
      : 0;

  return {
    id: String(patient.id),
    fullName: fullName || "Paciente sin nombre",
    age: calculatedAge,
    phone: patient.phone || "No disponible",
    email: patient.email || "No disponible",
    occupation: patient.occupation || "Sin Profesion",
    status: normalizedActive ? "activo" : "inactivo",
  };
};
