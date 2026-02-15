import React from 'react';
import { useParams } from 'react-router-dom';


const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <button className="text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-2 transition-colors">
            ← Volver a lista de pacientes
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">
            Perfil del Paciente
          </h1>
          <p className="text-slate-400 text-sm">ID: {id}</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Vista con tabs: (1) Información básica, (2) Sesiones clínicas, (3) Diagnósticos, (4) Resúmenes IA
          </p>
        </div>

        {/* Pestañas */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 px-6 py-3 flex gap-4">
            <button className="px-4 py-2 text-indigo-400 border-b-2 border-indigo-500 font-medium">
              Información básica
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">
              Sesiones clínicas
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">
              Diagnósticos
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">
              Resúmenes IA
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-slate-500 text-center py-8">
              Contenido de pestañas - Componentes pendientes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
