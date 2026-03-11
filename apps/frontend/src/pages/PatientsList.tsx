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
      `${patient.fullName} ${patient.occupation}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch, patientsForView]);

  const showEmptyState = !loading && !effectiveError && patients.length === 0;
  const showNoResultsState =
    !loading && !effectiveError && patients.length > 0 && filteredPatients.length === 0;

  return (
    <div className="min-h-screen">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="group mb-6 inline-flex items-center gap-2 rounded-[20px] bg-brand-primario px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-hover-primario cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 transition group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </button>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-700">Pacientes</h1>
            <p className="text-slate-500">Gestiona la información de tus pacientes</p>
          </div>
          <NewPatientDialog onSave={handleCreatePatient} />
        </div>

        <PatientSearchInput
          value={searchValue}
          onChange={setSearchValue}
          className="mb-6"
          placeholder="Buscar por nombre o email"
        />
        <PatientsCollectionSection
          loading={loading}
          error={effectiveError}
          showEmptyState={showEmptyState}
          showNoResultsState={showNoResultsState}
          searchValue={searchValue}
          patients={filteredPatients}
          onViewPatient={handleOpenDetail}
        />

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
