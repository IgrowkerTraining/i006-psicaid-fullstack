import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeactivatePatientAlertDialog } from '@/components/shared/patients/DeactivatePatientAlertDialog';
import { EditPatientDialog } from '@/components/shared/patients/EditPatientDialog';
import {
  type NewPatientFormValues,
  NewPatientDialog,
} from '@/components/shared/patients/NewPatientDialog';
import { PatientsCollectionSection } from '@/components/shared/patients/PatientsCollectionSection';
import { mapPatientToCard } from '@/components/shared/patients/patientMappers';
import { PatientSearchInput } from '@/components/shared/patients/PatientSearchInput';
import { ROUTES } from '@/constants/routes';
import { usePatients } from '@/hooks/usePatients';
import type { Patient } from '@/services/patients.service';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDeactivate, setPatientToDeactivate] = useState<Patient | null>(null);

  const {
    patients,
    loading,
    error: apiError,
    clearPatientsError,
    createPatient,
    updatePatient,
    deactivatePatient,
  } = usePatients();

  const effectiveError = interactionError ?? apiError;

  const handleCreatePatient = async (values: NewPatientFormValues) => {
    setInteractionError(null);
    clearPatientsError();
    await createPatient(values);
  };

  const handleOpenEdit = (patientId: string) => {
    const selected =
      patients.find((patient) => String(patient.id) === String(patientId)) ?? null;
    if (!selected) {
      setInteractionError('No se pudo abrir el formulario de edicion para este paciente.');
      return;
    }
    setInteractionError(null);
    setPatientToEdit(selected);
  };

  const handleOpenDeactivate = (patientId: string) => {
    const selected =
      patients.find((patient) => String(patient.id) === String(patientId)) ?? null;
    if (!selected) {
      setInteractionError('No se pudo abrir la confirmacion de desactivacion para este paciente.');
      return;
    }
    setInteractionError(null);
    setPatientToDeactivate(selected);
  };

  const handleOpenDetail = (patientId: string) => {
    const selected =
      patients.find((patient) => String(patient.id) === String(patientId)) ?? null;

    if (!selected) {
      setInteractionError('No se pudo abrir el detalle para este paciente.');
      return;
    }

    setInteractionError(null);
    navigate(ROUTES.PATIENT_DETAIL.replace(':id', String(selected.id)), {
      state: { patient: selected },
    });
  };

  const handleUpdatePatient = async (patientId: string, values: NewPatientFormValues) => {
    setInteractionError(null);
    clearPatientsError();
    await updatePatient(patientId, values);
  };

  const handleDeactivatePatient = async (patientId: string) => {
    setInteractionError(null);
    clearPatientsError();
    await deactivatePatient(patientId);
  };

  const patientsForView = useMemo(
    () => patients.map(mapPatientToCard),
    [patients]
  );

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredPatients = useMemo(() => {
    if (!normalizedSearch) {
      return patientsForView;
    }

    return patientsForView.filter((patient) =>
      `${patient.fullName} ${patient.email} ${patient.diagnosis}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch, patientsForView]);

  const showEmptyState = !loading && !effectiveError && patients.length === 0;
  const showNoResultsState =
    !loading && !effectiveError && patients.length > 0 && filteredPatients.length === 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-700">Pacientes</h1>
            <p className="text-slate-500">Gestiona la informacion de tus pacientes</p>
          </div>
          <NewPatientDialog onSave={handleCreatePatient} />
        </div>

        <PatientSearchInput
          value={searchValue}
          onChange={setSearchValue}
          className="mb-6"
          placeholder="Buscar paciente por nombre, apellido o email..."
        />
        <PatientsCollectionSection
          loading={loading}
          error={effectiveError}
          showEmptyState={showEmptyState}
          showNoResultsState={showNoResultsState}
          searchValue={searchValue}
          patients={filteredPatients}
          onViewPatient={handleOpenDetail}
          onEditPatient={handleOpenEdit}
          onDeactivatePatient={handleOpenDeactivate}
        />
      </div>

      <EditPatientDialog
        patient={patientToEdit}
        open={Boolean(patientToEdit)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPatientToEdit(null);
          }
        }}
        onConfirmUpdate={handleUpdatePatient}
      />

      <DeactivatePatientAlertDialog
        patient={patientToDeactivate}
        open={Boolean(patientToDeactivate)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPatientToDeactivate(null);
          }
        }}
        onConfirmDeactivate={handleDeactivatePatient}
      />
    </div>
  );
};

export default PatientsList;
