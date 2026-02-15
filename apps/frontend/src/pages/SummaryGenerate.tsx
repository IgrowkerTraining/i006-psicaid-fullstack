import React from 'react';
import { useParams } from 'react-router-dom';


const SummaryGenerate: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <button className="text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-2 transition-colors">
            ← Volver al perfil del paciente
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">
            Generar Resumen Clínico (IA)
          </h1>
          <p className="text-slate-400 text-sm">Paciente ID: {id}</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Interfaz para seleccionar periodo y generar resumen con IA. Conecta con backend Python.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Seleccionar Periodo
            </h2>
            <p className="text-slate-500 text-sm">
              Selector de rango de fechas - Componente pendiente
            </p>
          </div>

          <button
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Generar Resumen con IA
          </button>

          <div className="mt-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
            <p className="text-slate-500 text-sm text-center">
              Área de visualización del resumen generado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerate;
