import * as React from "react";
import { CalendarRange, Eye, Filter, Pencil, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import type { HistoricalSummaryResponse } from "@/services/ai-summaries.service";

import type { PatientTabPanelProps } from "./types";
import { PanelShell, SectionCard } from "./ui";

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const buildPreview = (content: string, maxLength = 260) => {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
};

const parseSummarySections = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const firstLine = lines[0] ?? "";
      const match = firstLine.match(/^([^:]+):\s*(.*)$/);

      if (!match) {
        return {
          title: `Detalle ${index + 1}`,
          body: lines.join("\n"),
        };
      }

      const [, title, firstValue] = match;
      const body = [firstValue, ...lines.slice(1)].filter(Boolean).join("\n").trim();

      return {
        title: title.trim(),
        body: body || "Sin detalle.",
      };
    });

type SummaryDetailDialogProps = {
  summary: HistoricalSummaryResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SummaryDetailDialog({ summary, open, onOpenChange }: SummaryDetailDialogProps) {
  const sections = React.useMemo(
    () => (summary ? parseSummarySections(summary.content) : []),
    [summary]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-200 bg-white text-slate-800 sm:max-w-4xl">
        {summary ? (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                <Sparkles className="size-5 text-[var(--brand-secundario)]" />
                Resumen generado
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                Periodo {formatDate(summary.dateFrom)} - {formatDate(summary.dateUntil)}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--brand-acento)]/60 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  ID resumen
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">#{summary.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Paciente
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">#{summary.patientId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Generado
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {formatDateTime(summary.generatedAt)}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {sections.map((section) => (
                <SectionCard key={`${summary.id}-${section.title}`} title={section.title}>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {section.body}
                  </p>
                </SectionCard>
              ))}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function AiSummaryTab({
  patient,
  summaries = [],
  summariesPage,
  summariesLoading = false,
  summariesError,
  onOpenGenerateSummary,
  onSummaryPageChange,
}: PatientTabPanelProps) {
  const [selectedSummary, setSelectedSummary] = React.useState<HistoricalSummaryResponse | null>(
    null
  );

  const handleOpenDetail = React.useCallback((summary: HistoricalSummaryResponse) => {
    setSelectedSummary(summary);
  }, []);

  const handleCloseDetail = React.useCallback((open: boolean) => {
    if (!open) {
      setSelectedSummary(null);
    }
  }, []);

  if (summariesLoading && summaries.length === 0) {
    return (
      <PanelShell>
        <div className="flex min-h-[320px] items-center justify-center">
          <p className="text-sm text-slate-500">Cargando resumenes clinicos...</p>
        </div>
      </PanelShell>
    );
  }

  return (
    <PanelShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-[var(--brand-primario)]/25 bg-brand-active-primario px-4 text-white hover:bg-brand-hover-primario hover:text-white cursor-pointer"
          >
            <Filter className="size-4" />
            Filtro
          </Button>

          {summariesPage ? (
            <p className="text-sm text-slate-500">
              {summariesPage.totalElements} resumenes para {patient.profile.fullName}
            </p>
          ) : null}
        </div>

        {summariesError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {summariesError}
          </div>
        ) : null}

        {summaries.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center py-12">
            <div className="mb-6 rounded-full bg-brand-gradient p-6">
              <Sparkles className="size-12 text-[var(--brand-secundario)]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">No hay resumenes generados</h3>
            <p className="max-w-md text-center text-sm text-slate-500">
              Todavia no hay resumenes historicos cargados para {patient.profile.fullName}.
            </p>
            <Button
              className="mt-5 rounded-xl bg-brand-primario px-4 text-white hover:bg-brand-hover-primario cursor-pointer"
              onClick={onOpenGenerateSummary}
            >
              Generar resumen IA
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {summaries.map((summary) => (
              <article
                key={summary.id}
                className="overflow-hidden rounded-2xl border border-[var(--brand-primario)]/35 bg-white shadow-[0_14px_36px_rgba(9,2,36,0.05)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-slate-50/90 px-5 py-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">Resumen generado</h3>
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarRange className="size-4 text-[var(--brand-terciario)]" />
                      {formatDate(summary.dateFrom)} - {formatDate(summary.dateUntil)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="rounded-full text-slate-700 hover:bg-slate-200 cursor-pointer"
                      onClick={() => handleOpenDetail(summary)}
                      aria-label={`Ver resumen ${summary.id}`}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="rounded-full text-slate-700 hover:bg-slate-200 cursor-pointer"
                      aria-label={`Eliminar resumen ${summary.id}`}
                      title="Proximamente"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="rounded-full text-slate-700 hover:bg-slate-200 cursor-pointer"
                      aria-label={`Editar resumen ${summary.id}`}
                      title="Proximamente"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 px-5 py-5">
                  <p className="text-sm leading-7 text-slate-700">{buildPreview(summary.content)}</p>
                  <p className="text-xs text-slate-500">
                    Generado el {formatDateTime(summary.generatedAt)}
                  </p>
                </div>
              </article>
            ))}

            {summariesPage && summariesPage.totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--brand-acento)]/70 px-4 py-3">
                <p className="text-sm text-slate-600">
                  Pagina {summariesPage.number + 1} de {summariesPage.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl cursor-pointer"
                    disabled={summariesPage.first || summariesLoading}
                    onClick={() => onSummaryPageChange?.(summariesPage.number - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl cursor-pointer"
                    disabled={summariesPage.last || summariesLoading}
                    onClick={() => onSummaryPageChange?.(summariesPage.number + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <SummaryDetailDialog
        summary={selectedSummary}
        open={Boolean(selectedSummary)}
        onOpenChange={handleCloseDetail}
      />
    </PanelShell>
  );
}

export default AiSummaryTab;
