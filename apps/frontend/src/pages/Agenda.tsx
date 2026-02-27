import React, { useState } from "react"
import { Calendar } from "@/components/common/calendar"

// TODO: Para integrar con sesiones reales del backend, necesitamos:
// 1. Endpoint: GET /api/dashboard/sessions?startDate=xxx&endDate=xxx
//    Debe retornar List<ClinicalSessionDTO> del profesional autenticado
// 2. Agregar campo 'patientFullName: String' a ClinicalSessionDTO
//    para mostrar el nombre del paciente en las tarjetas

const Agenda: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const selectedDateLabel = date
    ? date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Selecciona una fecha"

  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Agenda</h1>
        <p className="text-sm text-gray-600">
          Revisa tus sesiones programadas y consulta el detalle por fecha.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Calendario</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full rounded-md border-0"
            captionLayout="dropdown"
          />
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Sesiones del dia seleccionado
          </h2>

          <p className="text-sm capitalize text-gray-600">{selectedDateLabel}</p>

          <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] bg-brand-acento px-4 py-8 text-center">
            <p className="text-sm font-medium text-gray-900">
              No hay sesiones programadas para este dia.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Cuando integres el backend, aqui apareceran las citas de la fecha seleccionada.
            </p>
          </div>

          {/* TODO: Cuando backend agregue GET /api/dashboard/sessions,
              mostrar aqui las sesiones del dia seleccionado */}
        </section>
      </div>
    </>
  )
}

export default Agenda
