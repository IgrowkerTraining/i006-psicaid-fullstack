import React from 'react';
import { useParams } from 'react-router-dom';


const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <button className="text-[var(--brand-secundario)] hover:text-[var(--brand-primario)] mb-3 flex items-center gap-2 transition-colors">
            ← Volver a lista de pacientes
          </button>
          <h1 className="text-3xl font-bold text-[var(--brand-primario)] mb-1">
            Perfil del Paciente
          </h1>
          <p className="text-gray-600 text-sm">ID: {id}</p>
        </div>
        
        <div className="bg-amber-100 border border-amber-300 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-700 text-xs mt-1">
            Vista con tabs: (1) Información básica, (2) Sesiones clínicas, (3) Diagnósticos, (4) Resúmenes IA
          </p>
        </div>

        {/* Pestañas */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-gray-200 px-6 py-3 flex gap-4">
            <button className="px-4 py-2 text-[var(--brand-secundario)] border-b-2 border-[var(--brand-secundario)] font-medium">
              Información básica
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-[var(--brand-primario)] transition-colors">
              Sesiones clínicas
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-[var(--brand-primario)] transition-colors">
              Diagnósticos
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-[var(--brand-primario)] transition-colors">
              Resúmenes IA
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              Contenido de pestañas - Componentes pendientes
            </p>
          </div>
        </div>
      </div>
  );
};

export default PatientDetail;
