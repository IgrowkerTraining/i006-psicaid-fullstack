import React from 'react';


const PatientSearch: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Buscar Paciente
          </h1>
          <p className="text-slate-400">Encuentra pacientes por nombre, apellido o DNI</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Buscador con filtros por nombre, apellido, DNI. Resultados clickeables que llevan al perfil.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6">
            <input
              type="search"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="Buscar por nombre, apellido o DNI..."
              disabled
            />
          </div>
          
          <p className="text-slate-500 text-sm text-center py-8">
            Resultados de búsqueda - Componente pendiente
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;
