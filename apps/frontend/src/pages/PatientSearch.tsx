import React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/common/Button';
import {
  type PatientResult,
  PatientResultCard,
} from '@/components/shared/patients/PatientResultCard';
import { PatientSearchInput } from '@/components/shared/patients/PatientSearchInput';

const initialPatients: PatientResult[] = [
  {
    id: 'patient-001',
    fullName: 'Maria Gonzalez',
    age: 32,
    phone: '+34 612 345 678',
    email: 'maria.gonzalez@email.com',
    diagnosis: 'Ansiedad generalizada',
    status: 'activo',
  },
  {
    id: 'patient-002',
    fullName: 'Carlos Rodriguez',
    age: 45,
    phone: '+34 623 456 789',
    email: 'carlos.rodriguez@email.com',
    diagnosis: 'Terapia de pareja',
    status: 'activo',
  },
  {
    id: 'patient-003',
    fullName: 'Laura Jimenez',
    age: 28,
    phone: '+34 634 567 890',
    email: 'laura.jimenez@email.com',
    diagnosis: 'Trastorno adaptativo',
    status: 'inactivo',
  },
];

const PatientSearch: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleNewPatient = () => {
    // Placeholder: el flujo real se conectara en otro issue.
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl p-6 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Pacientes</h1>
            <p className="text-slate-400">Gestiona la informacion de tus pacientes</p>
          </div>

          <Button
            className="rounded-xl bg-indigo-600 px-6 text-white hover:bg-indigo-700"
            onClick={handleNewPatient}
          >
            <Plus className="size-4" />
            Nuevo Paciente
          </Button>
        </div>

        <PatientSearchInput
          value={searchValue}
          onChange={setSearchValue}
          className="mb-6"
          placeholder="Buscar paciente por nombre, apellido o email..."
        />

        <div className="space-y-4">
          {initialPatients.map((patient) => (
            <PatientResultCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;
