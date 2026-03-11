import * as React from "react";
import { Calendar, Calendar1, FileText, TrendingUp, User2, Users } from "lucide-react";

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
      icon: <Calendar/>,
    },
    {
      label: "Esta semana",
      value: String(data.sessionsThisWeek),
      subText: "Sesiones programadas",
      icon: <TrendingUp/>,
    },
    {
      label: "Total Pacientes",
      value: String(data.totalActivePatients),
      subText: "Pacientes activos",
      icon: <User2/>,
    },
    {
      label: "Sesiones completadas",
      value: String(data.sessionsThisMonth),
      subText: "Este mes",
      icon: <Calendar/>,
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
