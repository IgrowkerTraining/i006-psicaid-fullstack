import React, { useState, useEffect } from "react";
import { getAIGreeting } from "../services/service";
import { useAuth } from "../hooks/useAuth";
import { StatsCard } from "@/components/shared/dashboard/StatsCard";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";
import { AgendaCalendar } from "@/components/shared/dashboard/AgendaCalendar";
import { ProximasSesiones } from "@/components/shared/dashboard/ProximasSesiones";
import { type DashboardAppointmentLog } from "@/components/shared/dashboard/DashboardLogsAppointments";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("Loading greeting...");
  const [stats] = useState([
    { label: "Sesiones de hoy", value: "2", subtext: 'Pacientes activos', icon: <Calendar className="text-[var(--brand-secundario)]" /> },
    { label: "Esta semana", value: "5", subtext: 'Citas programadas', icon: <TrendingUp className="text-[var(--brand-secundario)]" /> },
    { label: "Total Pacientes", value: "10", subtext: 'Pacientes activos', icon: <Users className="text-[var(--brand-secundario)]" /> },
    { label: "Sesiones completadas", value: "5", subtext: 'Este mes', icon: <FileText className="text-[var(--brand-secundario)]" /> },
  ]);
  const [appointmentLogs] = useState<DashboardAppointmentLog[]>([
    {
      id: "appt-001",
      date: "18 Feb 2026",
      time: "09:00",
      patientName: "Ana Morales",
      diagnosis: "Ansiedad generalizada",
      status: "confirmada",
      url: "/patients/patient-001",
    },
    {
      id: "appt-002",
      date: "18 Feb 2026",
      time: "10:30",
      patientName: "Carlos Rojas",
      diagnosis: "Insomnio cronico",
      status: "seguimiento",
      url: "/patients/patient-002",
    },
    {
      id: "appt-003",
      date: "18 Feb 2026",
      time: "12:00",
      patientName: "Lucia Herrera",
      diagnosis: "Trastorno de panico",
      status: "prioritaria",
      url: "/patients/patient-003",
    },
    {
      id: "appt-004",
      date: "18 Feb 2026",
      time: "15:30",
      patientName: "Jorge Sanchez",
      diagnosis: "Depresion moderada",
      status: "seguimiento",
      url: "/patients/patient-004",
    },
  ]);

  useEffect(() => {
    const initDashboard = async () => {
      const userName = user ? user.firstName : "";
      const [msg] = await Promise.all([
        getAIGreeting(userName),
      ]);
      setGreeting(msg);
    };
    initDashboard();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#e8ebf9]">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[var(--brand-primario)] mb-2">{greeting}</h2>
            <p className="text-gray-600">
              Everything looks optimal in your workspace today.
            </p>
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
