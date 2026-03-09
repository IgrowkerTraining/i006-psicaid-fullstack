import * as React from "react";

import { cn } from "@/lib/utils";

import {
  AiSummaryTab,
  PatientRecordTab,
  SessionsTab,
  TreatmentsTab,
  type TabId,
} from "./tabs";
import type { PatientDetailViewModel } from "./types";

type PatientDetailTabsProps = {
  patient: PatientDetailViewModel;
  onActiveTabChange?: (tabId: TabId) => void;
  sessionRefreshKey?: number;
  treatmentCreateRequestKey?: number;
};

type TabItem = {
  id: TabId;
  label: string;
  content: React.ReactNode;
};

export function PatientDetailTabs({
  patient,
  onActiveTabChange,
  sessionRefreshKey,
  treatmentCreateRequestKey,
}: PatientDetailTabsProps) {
  const tabsId = React.useId();
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const tabs = React.useMemo<TabItem[]>(
    () => [
      {
        id: "ficha",
        label: "Ficha paciente",
        content: <PatientRecordTab patient={patient} />,
      },
      {
        id: "tratamientos",
        label: "Tratamientos",
        content: (
          <TreatmentsTab
            patient={patient}
            createRequestKey={treatmentCreateRequestKey}
          />
        ),
      },
      {
        id: "sesiones",
        label: "Sesiones clinicas",
        content: <SessionsTab patient={patient} sessionRefreshKey={sessionRefreshKey} />,
      },
      {
        id: "resumen",
        label: "Resumen IA",
        content: <AiSummaryTab patient={patient} />,
      },
    ],
    [patient, sessionRefreshKey, treatmentCreateRequestKey]
  );

  const [activeTabId, setActiveTabId] = React.useState<TabId>("ficha");

  React.useEffect(() => {
    onActiveTabChange?.(activeTabId);
  }, [activeTabId, onActiveTabChange]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const focusAndActivate = React.useCallback(
    (nextIndex: number) => {
      const nextTab = tabs[nextIndex];
      if (!nextTab) {
        return;
      }

      setActiveTabId(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    },
    [tabs]
  );

  const handleTabKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      if (event.key === "Home") {
        focusAndActivate(0);
        return;
      }

      if (event.key === "End") {
        focusAndActivate(tabs.length - 1);
        return;
      }

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      focusAndActivate(nextIndex);
    },
    [focusAndActivate, tabs.length]
  );

  return (
    <section className="rounded-3xl border border-white/70 bg-white/65 p-3 shadow-[0_20px_60px_rgba(9,2,36,0.08)] backdrop-blur">
      <div
        role="tablist"
        aria-label="Detalle del paciente"
        className="mb-3 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)]/80 bg-[var(--brand-acento)]/80 p-2"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab.id;
          const tabId = `${tabsId}-${tab.id}-tab`;
          const panelId = `${tabsId}-${tab.id}-panel`;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={cn(
                "inline-flex justify-center grow min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4 cursor-pointer",
                isActive
                  ? "bg-brand-active-primario text-white shadow-[0_10px_24px_rgba(9,2,36,0.08)]"
                  : "text-slate-600 hover:bg-brand-hover-primario hover:text-white"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab.id;
        const tabId = `${tabsId}-${tab.id}-tab`;
        const panelId = `${tabsId}-${tab.id}-panel`;

        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </section>
  );
}

export default PatientDetailTabs;

