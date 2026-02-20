import * as React from "react"
import { CalendarDays, Clock3, Stethoscope } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar"
import { format } from "@/utils/format"
import {
  type DashboardAppointmentLog,
} from "./DashboardLogsAppointments"

type UltimasSesionesProps = {
  logs: DashboardAppointmentLog[]
}

const statusBorderByType = {
  confirmada: "ring-2 ring-emerald-500",
  seguimiento: "ring-2 ring-sky-500",
  prioritaria: "ring-2 ring-amber-500",
}

export function UltimasSesiones({ logs }: UltimasSesionesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-[var(--brand-primario)] mb-4">
        Tus últimas sesiones
      </h3>
      
      <div className="space-y-4">
        {logs.map((appointment) => {
          const [dateText, timeText] = appointment.date.split(" - ")
          const appointmentTime = appointment.time || timeText

          return (
            <Link
              key={appointment.id}
              to={appointment.url}
              className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-[var(--brand-secundario)] bg-white hover:bg-gray-50 transition-all"
            >
              <Avatar className={`h-10 w-10 flex-shrink-0 ${statusBorderByType[appointment.status]}`}>
                <AvatarFallback className="bg-[var(--brand-secundario)] text-white text-sm font-medium">
                  {format.getInitials(appointment.patientName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--brand-primario)] mb-2">
                  {appointment.patientName}
                </p>
                <p className="text-xs text-gray-600 inline-flex items-center gap-1.5 mb-3">
                  <Stethoscope className="size-3.5 text-gray-500" />
                  Motivo / diagnostico: {appointment.diagnosis}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    Fecha: {dateText || appointment.date}
                  </span>
                  {appointmentTime ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5" />
                      Hora: {appointmentTime}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex-shrink-0">
                <span className="text-xs text-[var(--brand-secundario)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalle →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
