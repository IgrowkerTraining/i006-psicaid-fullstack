import * as React from "react"
import { Calendar } from "@/components/common/calendar"

export function AgendaCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-3 py-4 shadow-sm w-fit mx-auto">
      <h3 className="text-xl font-semibold text-[var(--brand-primario)] mb-3 pl-0.5">
        Tu agenda
      </h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border-0 p-0"
        captionLayout="dropdown"
      />
      {date && (
        <p className="text-xs text-gray-500 mt-3 pl-0.5">
          Fecha seleccionada: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
