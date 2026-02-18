import React, { useState, useEffect } from "react";
import { Button } from "../components/common/Button";
import { getAIGreeting } from "../services/service";
import { useAuth } from "../hooks/useAuth";
import { StatsCard } from "@/components/shared/dashboard/StatsCard";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";
import {
  DashboardLogsAppointments,
  type DashboardAppointmentLog,
} from "@/components/shared/dashboard/DashboardLogsAppointments";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [greeting, setGreeting] = useState<string>("Loading greeting...");
  const [stats] = useState([
    { label: "Total Pacientes", value: "2", subtext: 'Pacientes activos', icon: <Users className="text-gray-600" /> },
    { label: "Citas de Hoy", value: "0", subtext: 'Sesiones programadas', icon: <Calendar className="text-gray-600" /> },
    { label: "Esta Semana", value: "0", subtext: 'Citas programadas', icon: <TrendingUp className="text-gray-600" /> },
    { label: "Sesiones Completadas", value: "0", subtext: 'Este mes', icon: <FileText className="text-gray-600" /> },
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
      const [msg] = await Promise.all([
        getAIGreeting(user?.name || ""),
      ]);
      setGreeting(msg);
    };
    initDashboard();
  }, [user?.name]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">{greeting}</h2>
          <p className="text-slate-400">
            Everything looks optimal in your workspace today.
          </p>
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
          <section className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white">Tus últimas sesiones</h3>
            <DashboardLogsAppointments logs={appointmentLogs} />
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Identity Insight
            </h3>
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={user.avatar}
                  className="w-16 h-16 rounded-2xl"
                  alt=""
                />
                <div>
                  <h4 className="font-bold text-white text-lg">{user.name}</h4>
                  <p className="text-indigo-400 text-sm">@{user.username}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Account ID</span>
                  <span className="text-slate-200 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Encryption Level</span>
                  <span className="text-emerald-400 font-bold">SHA-512</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Member Since</span>
                  <span className="text-slate-200">Feb 2024</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-6">
                Edit Profile
              </Button>
            </div>
          </section>
        </div>
      </main>

      <div className="sm:hidden sticky bottom-0 p-4 bg-slate-950 border-t border-slate-800">
        <Button variant="outline" className="w-full" onClick={logout}>
          Log Out of Nexus
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
