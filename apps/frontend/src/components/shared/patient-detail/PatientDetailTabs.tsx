import * as React from "react";
import {
  BrainCircuit,
  CalendarClock,
  ClipboardList,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  AiSummaryTab,
  ClinicalHistoryTab,
  PatientRecordTab,
  SessionsTab,
  type TabId,
} from "./tabs";
import type { PatientDetailViewModel } from "./types";

type PatientDetailTabsProps = {
  patient: PatientDetailViewModel;
};

type TabItem = {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
};

export function PatientDetailTabs({ patient }: PatientDetailTabsProps) {
  const tabsId = React.useId();
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const tabs = React.useMemo<TabItem[]>(
    () => [
      {
        id: "ficha",
        label: "Ficha paciente",
        icon: ClipboardList,
        content: <PatientRecordTab patient={patient} />,
      },
      {
        id: "historia",
        label: "Historia clinica",
        icon: BrainCircuit,
        content: <ClinicalHistoryTab patient={patient} />,
      },
      {
        id: "sesiones",
        label: "Sesiones clinicas",
        icon: CalendarClock,
        content: <SessionsTab patient={patient} />,
      },
      {
        id: "resumen",
        label: "Resumen IA",
        icon: Sparkles,
        content: <AiSummaryTab patient={patient} />,
      },
    ],
    [patient]
  );

  const [activeTabId, setActiveTabId] = React.useState<TabId>("historia");

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
          const Icon = tab.icon;
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
                "inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4",
                isActive
                  ? "bg-white text-[var(--brand-primario)] shadow-[0_10px_24px_rgba(9,2,36,0.08)] ring-1 ring-[var(--brand-secundario)]/15"
                  : "text-slate-600 hover:bg-white/70 hover:text-[var(--brand-secundario)]"
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-[var(--brand-terciario)]" : "")} />
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

