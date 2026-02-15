import React from 'react';


const PatientNew: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Registrar Nuevo Paciente
          </h1>
          <p className="text-slate-400">Completa los datos del nuevo paciente</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Formulario de registro con campos: identificador, nombre, apellido, edad, sexo, estado civil, ocupación, fecha inicio, frecuencia.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Identificador (DNI/NIE)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Esperando componente de UX"
                disabled
              />
            </div>
            
            <p className="text-slate-500 text-sm text-center py-8">
              Formulario completo - Componente pendiente
            </p>

            <button
              type="button"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all duration-200"
              disabled
            >
              Guardar Paciente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientNew;
