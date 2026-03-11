import * as React from "react"
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/common/avatar"
import { format } from "@/utils/format"
import { type DashboardAppointmentLog } from "./DashboardLogsAppointments"

type ProximasSesionesProps = {
  logs: DashboardAppointmentLog[]
  loading?: boolean
  error?: string | null
}

const SKELETON_ROWS = 3

const statusBorderByType: Record<DashboardAppointmentLog["status"], string> = {
  confirmada: "ring-2 ring-emerald-500",
  seguimiento: "ring-2 ring-sky-500",
  prioritaria: "ring-2 ring-amber-500",
}

function ProximasSesionesSkeletonRows() {
  return (
    <div className="space-y-4">
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <div
          key={`session-skeleton-${index}`}
          className="rounded-xl border border-gray-200 bg-white p-4"
          aria-hidden="true"
        >
          <div className="animate-pulse flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="flex-1">
              <div className="mb-2 h-4 w-40 rounded bg-slate-200" />
              <div className="mb-3 h-3 w-3/4 rounded bg-slate-200" />
              <div className="flex flex-wrap gap-3">
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="h-3 w-20 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProximasSesiones({
  logs,
  loading = false,
  error = null,
}: ProximasSesionesProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-primary-foreground  mb-4">
        Tus proximas sesiones
      </h3>

      {loading ? (
        <ProximasSesionesSkeletonRows />
      ) : error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <CalendarDays className="mx-auto mb-3 size-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            No tienes proximas sesiones programadas
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Cuando registres nuevas sesiones aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((appointment) => {
            const [dateText, timeText] = appointment.date.split(" - ")
            const appointmentTime = appointment.time || timeText

            const nameParts = appointment.patientName.split(' ');
            const patientState = appointment.patientId != null
              ? { patient: { id: appointment.patientId, firstName: nameParts[0] ?? '', lastName: nameParts.slice(1).join(' ') } }
              : undefined;

            return (
              <Link
                key={appointment.id}
                to={appointment.url}
                state={patientState}
                className="flex items-center gap-4 p-4 rounded-[8px] border border-[#8995DF] hover:border-brand-primario bg-white hover:bg-gray-50 transition-all"
              >
                <Avatar
                  className={`h-10 w-10 shrink-0 ${statusBorderByType[appointment.status]}`}
                >
                  <AvatarFallback className="bg-brand-primario text-white text-sm font-medium">
                    {format.getInitials(appointment.patientName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-foreground mb-1">
                    {appointment.patientName}
                  </p>
                  <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-brand-primario" />
                      Fecha: {dateText || appointment.date}
                    </span>
                    {appointmentTime ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-brand-primario" />
                        Hora: {appointmentTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-xs text-brand-primario flex items-center gap-1">
                    Ver sesión <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
