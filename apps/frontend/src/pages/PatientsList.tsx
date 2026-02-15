import React from 'react';


const PatientsList: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto w-full p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Lista de Pacientes
            </h1>
            <p className="text-slate-400">Gestiona y visualiza todos tus pacientes</p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200">
            + Registrar Paciente
          </button>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Aquí se mostrará la tabla/lista de pacientes con búsqueda, filtros y acciones.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <p className="text-slate-500 text-center">
            Tabla de pacientes - Componente pendiente
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
