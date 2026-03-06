import * as React from "react";
import { Suspense } from "react";
import { format } from "date-fns";

import {
  type DashboardAppointmentLog,
} from "@/components/shared/dashboard/DashboardLogsAppointments";
import {
  type DashboardStats,
  type UpcomingSession,
} from "@/services/dashboard.service";

type DashboardPanelsGridProps = {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
};

const LazyAgendaCalendar = React.lazy(async () => {
  const module = await import("@/components/shared/dashboard/AgendaCalendar");
  return { default: module.AgendaCalendar };
});

const LazyProximasSesiones = React.lazy(async () => {
  const module = await import("@/components/shared/dashboard/ProximasSesiones");
  return { default: module.ProximasSesiones };
});

const AgendaCalendarFallback: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-2xl px-3 py-4 shadow-sm w-full max-w-90 mx-auto">
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-28 rounded bg-slate-200" />
      <div className="h-72.5 rounded-xl bg-slate-100 border border-slate-200" />
      <div className="mt-3 h-3 w-40 rounded bg-slate-200" />
    </div>
  </div>
);

const ProximasSesionesModuleFallback: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-52 rounded bg-slate-200" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`proximas-sesiones-module-fallback-${index}`}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-44 rounded bg-slate-200" />
                <div className="mb-3 h-3 w-3/4 rounded bg-slate-200" />
                <div className="flex gap-3">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function mapUpcomingSessionToAppointmentLog(
  session: UpcomingSession
): DashboardAppointmentLog {
  const sessionDate = new Date(session.sessionDateTime);

  return {
    id: `session-${session.sessionId}`,
    date: format(sessionDate, "dd MMM yyyy"),
    time: format(sessionDate, "HH:mm"),
    patientName: session.patientFullName,
    diagnosis: "Sesion programada",
    status: "confirmada",
    url: `/patients/${session.patientId}`,
    patientId: session.patientId,
  };
}

export function DashboardPanelsGrid({
  data,
  loading,
  error,
}: DashboardPanelsGridProps) {
  const appointmentLogs =
    data?.upcomingSessions.map(mapUpcomingSessionToAppointmentLog) ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2">
        <Suspense fallback={<ProximasSesionesModuleFallback />}>
          <LazyProximasSesiones
            logs={appointmentLogs}
            loading={loading}
            error={!loading ? error : null}
          />
        </Suspense>
      </section>

      <section>
        <Suspense fallback={<AgendaCalendarFallback />}>
          <LazyAgendaCalendar />
        </Suspense>
      </section>
    </div>
  );
}
