import { useEffect, useState } from "react";
import { apiFetch } from "api/client";
import {
  dashboardKpis,
  expenseBreakdown,
  inventoryAlerts,
  revenueTrend,
  supplierReminders,
} from "data/mockData";

const fallback = {
  kpis: dashboardKpis,
  revenueTrend,
  expenseBreakdown,
  inventoryAlerts,
  supplierReminders,
};

export function useDashboardSummary() {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("mock");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const remote = await apiFetch("/api/dashboard/summary");
        if (!cancelled && remote) {
          setData(remote);
          setSource("api");
        }
      } catch {
        if (!cancelled) {
          setData(fallback);
          setSource("mock");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, source };
}
