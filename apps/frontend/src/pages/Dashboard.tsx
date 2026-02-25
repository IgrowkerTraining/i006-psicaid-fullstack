import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { StatsCard } from "@/components/shared/dashboard/StatsCard";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";
import { AgendaCalendar } from "@/components/shared/dashboard/AgendaCalendar";
import { ProximasSesiones } from "@/components/shared/dashboard/ProximasSesiones";
import { type DashboardAppointmentLog } from "@/components/shared/dashboard/DashboardLogsAppointments";
import { dashboardService, type DashboardStats, type UpcomingSession } from "@/services/dashboard.service";
import { format } from "date-fns";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const greeting = user?.firstName 
    ? `Hola de nuevo, ${user.firstName}. Tu espacio terapéutico está listo.`
    : "Hola de nuevo. Tu espacio terapéutico está listo.";

  const transformUpcomingSession = (session: UpcomingSession): DashboardAppointmentLog => {
    const date = new Date(session.sessionDateTime);
    return {
      id: `session-${session.sessionId}`,
      date: format(date, 'dd MMM yyyy'),
      time: format(date, 'HH:mm'),
      patientName: session.patientFullName,
      // TODO: Backend podría agregar campo 'diagnosis' o 'reasonConsultation' a UpcomingSessionDTO
      // para mostrar motivo de consulta real en vez de placeholder
      diagnosis: "Sesión programada",
      status: "confirmada",
      url: `/patients/${session.patientId}`,
    };
  };

  const stats = dashboardData ? [
    { label: "Sesiones de hoy", value: String(dashboardData.sessionsToday), subtext: 'Pacientes activos', icon: <Calendar className="text-[var(--brand-secundario)]" /> },
    { label: "Esta semana", value: String(dashboardData.sessionsThisWeek), subtext: 'Citas programadas', icon: <TrendingUp className="text-[var(--brand-secundario)]" /> },
    { label: "Total Pacientes", value: String(dashboardData.totalActivePatients), subtext: 'Pacientes activos', icon: <Users className="text-[var(--brand-secundario)]" /> },
    { label: "Sesiones completadas", value: String(dashboardData.sessionsThisMonth), subtext: 'Este mes', icon: <FileText className="text-[var(--brand-secundario)]" /> },
  ] : [];

  const appointmentLogs = dashboardData?.upcomingSessions.map(transformUpcomingSession) || [];

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const data = await dashboardService.getStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#e8ebf9]">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[var(--brand-primario)] mb-2">{greeting}</h2>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subText={stat.subtext}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <ProximasSesiones logs={appointmentLogs} />
          </section>

          <section>
            <AgendaCalendar />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
