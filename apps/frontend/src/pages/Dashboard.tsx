import React from "react";

import { DashboardPanelsGrid } from "@/components/shared/dashboard/DashboardPanelsGrid";
import { DashboardStatsGrid } from "@/components/shared/dashboard/DashboardStatsGrid";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, loading, error } = useDashboardData(user?.id);

  const greeting = user?.firstName
    ? `Hola de nuevo, ${user.firstName}. Tu espacio terapeutico esta listo.`
    : "Hola de nuevo. Tu espacio terapeutico esta listo.";

  return (
    <div className="min-h-screen flex flex-col bg-[#e8ebf9]">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}
            </h2>
          </div>
        </header>

        {error && !loading ? (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <DashboardStatsGrid data={dashboardData} loading={loading} />
        <DashboardPanelsGrid data={dashboardData} loading={loading} error={error} />
    </div>
  );
};

export default Dashboard;
