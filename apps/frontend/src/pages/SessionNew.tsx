import React from 'react';
import { useParams } from 'react-router-dom';


const SessionNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <button className="text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-2 transition-colors">
            ← Volver al perfil del paciente
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">
            Registrar Nueva Sesión
          </h1>
          <p className="text-slate-400 text-sm">Paciente ID: {id}</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Formulario: fecha, tipo sesión, duración, observaciones, medicamentos, intervenciones.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-500 text-center py-8">
            Formulario de sesión clínica - Componente pendiente
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionNew;
