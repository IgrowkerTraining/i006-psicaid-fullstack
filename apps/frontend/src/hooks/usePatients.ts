import * as React from "react";

import {
  type CreatePatientDto,
  type Patient,
  patientsService,
  type UpdatePatientDto,
} from "@/services/patients.service";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const usePatients = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refreshPatients = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientsService.list();
      setPatients(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Error al cargar los pacientes");
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = React.useCallback(
    async (payload: CreatePatientDto) => {
      setError(null);
      try {
        await patientsService.create(payload);
        await refreshPatients();
      } catch (error) {
        const message = getErrorMessage(error, "Error al crear el paciente");
        setError(message);
        throw error;
      }
    },
    [refreshPatients]
  );

  const updatePatient = React.useCallback(
    async (patientId: string, payload: UpdatePatientDto) => {
      setError(null);
      try {
        await patientsService.update(patientId, payload);
        await refreshPatients();
      } catch (error) {
        const message = getErrorMessage(error, "Error al actualizar el paciente");
        setError(message);
        throw error;
      }
    },
    [refreshPatients]
  );

  const deactivatePatient = React.useCallback(
    async (patientId: string) => {
      setError(null);
      try {
        await patientsService.deactivate(patientId);
        await refreshPatients();
      } catch (error) {
        const message = getErrorMessage(error, "Error al desactivar el paciente");
        setError(message);
        throw error;
      }
    },
    [refreshPatients]
  );

  const clearPatientsError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    void refreshPatients();
  }, [refreshPatients]);

  return {
    patients,
    loading,
    error,
    clearPatientsError,
    refreshPatients,
    createPatient,
    updatePatient,
    deactivatePatient,
  };
};
