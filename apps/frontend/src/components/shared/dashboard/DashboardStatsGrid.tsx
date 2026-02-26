import * as React from "react";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";

import { type DashboardStats } from "@/services/dashboard.service";
import { StatsCard, StatsCardSkeleton } from "@/components/shared/dashboard/StatsCard";

type DashboardStatsGridProps = {
  data: DashboardStats | null;
  loading: boolean;
};

type DashboardStatItem = {
  label: string;
  value: string;
  subText: string;
  icon: React.ReactNode;
};

const STATS_SKELETON_COUNT = 4;

function buildStats(data: DashboardStats): DashboardStatItem[] {
  return [
    {
      label: "Sesiones de hoy",
      value: String(data.sessionsToday),
      subText: "Pacientes activos",
      icon: <Calendar className="text-brand-secundario" />,
    },
    {
      label: "Esta semana",
      value: String(data.sessionsThisWeek),
      subText: "Citas programadas",
      icon: <TrendingUp className="text-brand-secundario" />,
    },
    {
      label: "Total Pacientes",
      value: String(data.totalActivePatients),
      subText: "Pacientes activos",
      icon: <Users className="text-brand-secundario" />,
    },
    {
      label: "Sesiones completadas",
      value: String(data.sessionsThisMonth),
      subText: "Este mes",
      icon: <FileText className="text-brand-secundario" />,
    },
  ];
}

export function DashboardStatsGrid({ data, loading }: DashboardStatsGridProps) {
  const stats = data ? buildStats(data) : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {loading
        ? Array.from({ length: STATS_SKELETON_COUNT }).map((_, index) => (
            <StatsCardSkeleton key={`dashboard-stat-skeleton-${index}`} />
          ))
        : stats.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subText={stat.subText}
              icon={stat.icon}
            />
          ))}
    </div>
  );
}
