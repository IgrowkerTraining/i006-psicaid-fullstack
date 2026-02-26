import * as React from "react";

import {
  dashboardService,
  type DashboardStats,
} from "@/services/dashboard.service";

type UseDashboardDataResult = {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
};

export function useDashboardData(refreshKey?: string | number | null): UseDashboardDataResult {
  const [data, setData] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await dashboardService.getStats();
        if (!isMounted) return;
        setData(response);
      } catch (cause) {
        console.error("Error loading dashboard:", cause);
        if (!isMounted) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar la informacion del dashboard."
        );
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return { data, loading, error };
}
