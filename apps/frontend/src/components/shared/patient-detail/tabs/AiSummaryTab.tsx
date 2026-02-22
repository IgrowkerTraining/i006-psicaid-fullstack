import { Sparkles } from "lucide-react";

import type { PatientTabPanelProps } from "./types";
import { BulletList, PanelShell, SectionCard } from "./ui";

export function AiSummaryTab({ patient }: PatientTabPanelProps) {
  const ai = patient.aiSummary;

  return (
    <PanelShell>
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--brand-secundario)]/20 bg-gradient-to-r from-[var(--brand-secundario)]/10 via-white to-[var(--brand-terciario)]/10 p-4 shadow-[0_10px_24px_rgba(9,2,36,0.05)]">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand-secundario)]/30 bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--brand-secundario)]">
              <Sparkles className="size-3.5" />
              Resumen IA
            </span>
            <span className="rounded-full border border-[var(--brand-terciario)]/30 bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--brand-terciario)]">
              {ai.confidenceLabel}
            </span>
          </div>
          <p className="text-sm leading-7 text-slate-700">{ai.currentState}</p>
          <p className="mt-2 text-xs text-slate-500">Generado: {ai.generatedAt}</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Patrones clave detectados">
            <BulletList items={ai.keyPatterns} />
          </SectionCard>
          <SectionCard title="Recomendaciones sugeridas" subtitle="Orientativo, validar con criterio clinico">
            <BulletList items={ai.recommendations} tone="tertiary" />
          </SectionCard>
          <SectionCard title="Enfoque proxima sesion">
            <BulletList items={ai.nextSessionFocus} />
          </SectionCard>
          <SectionCard title="Alertas y monitoreo">
            <BulletList items={ai.riskFlags} tone="tertiary" />
          </SectionCard>
        </div>
      </div>
    </PanelShell>
  );
}

export default AiSummaryTab;

