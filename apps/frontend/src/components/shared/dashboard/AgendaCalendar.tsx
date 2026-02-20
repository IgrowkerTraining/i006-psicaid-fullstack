import * as React from "react"
import { Calendar } from "@/components/common/calendar"

export function AgendaCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-[var(--brand-primario)] mb-4">
        Tu agenda
      </h3>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0"
          captionLayout="dropdown"
        />
      </div>
      {date && (
        <p className="text-center text-gray-500 mt-4">
          Fecha seleccionada: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
