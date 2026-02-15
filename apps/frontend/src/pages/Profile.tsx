import React from 'react';


const Profile: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto w-full p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-slate-400">Configura tu información personal y preferencias</p>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <p className="text-amber-200 text-sm font-medium">
            🎨 Placeholder - Diseño pendiente de UX
          </p>
          <p className="text-amber-300/70 text-xs mt-1">
            Perfil del psicólogo: datos personales, configuración, preferencias, cerrar sesión.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Información Personal
            </h2>
            <p className="text-slate-500 text-sm">
              Datos del psicólogo - Componente pendiente
            </p>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Configuración
            </h2>
            <p className="text-slate-500 text-sm">
              Preferencias y ajustes - Componente pendiente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
