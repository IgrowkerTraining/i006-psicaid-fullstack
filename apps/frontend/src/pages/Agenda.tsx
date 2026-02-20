import React, { useState } from "react";
import { Calendar } from "@/components/common/calendar";

const Agenda: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--brand-primario)] mb-2">
          Agenda
        </h1>
        <p className="text-gray-600">
          Gestiona tus citas y sesiones programadas
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[var(--brand-primario)] mb-4">
            Calendario
          </h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-0"
            captionLayout="dropdown"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[var(--brand-primario)] mb-4">
            Citas del día seleccionado
          </h3>
          <p className="text-gray-500 text-sm">
            {date ? date.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Selecciona una fecha'}
          </p>
          <div className="mt-6 text-gray-400 text-sm text-center py-8">
            No hay citas programadas para este día
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
