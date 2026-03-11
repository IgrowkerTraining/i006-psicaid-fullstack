import * as React from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarRange, Check, Sparkles } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/common/Button";
import { Calendar } from "@/components/common/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import {
  aiSummariesService,
  type HistoricalSummaryResponse,
} from "@/services/ai-summaries.service";

type GenerateSummaryDialogProps = {
  patientId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated?: (summary: HistoricalSummaryResponse) => void;
};

const buildInitialRange = (): DateRange => ({
  from: subDays(new Date(), 30),
  to: new Date(),
});

const formatApiDate = (value: Date) => format(value, "yyyy-MM-dd");

const formatRangeLabel = (range: DateRange | undefined) => {
  if (!range?.from && !range?.to) {
    return "Selecciona un rango de fechas";
  }

  if (range.from && !range.to) {
    return format(range.from, "dd/MM/yyyy", { locale: es });
  }

  if (range.from && range.to) {
    return `${format(range.from, "dd/MM/yyyy", { locale: es })} - ${format(
      range.to,
      "dd/MM/yyyy",
      { locale: es }
    )}`;
  }

  return "Selecciona un rango de fechas";
};

export function GenerateSummaryDialog({
  patientId,
  open,
  onOpenChange,
  onGenerated,
}: GenerateSummaryDialogProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(
    buildInitialRange()
  );
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setSelectedRange(buildInitialRange());
      setSubmitError(null);
      setIsGenerating(false);
    }
  };

  const isSubmitDisabled =
    isGenerating ||
    !selectedRange?.from ||
    !selectedRange?.to ||
    !Number.isFinite(patientId) ||
    patientId <= 0;

  const handleGenerate = async () => {
    if (isSubmitDisabled || !selectedRange?.from || !selectedRange?.to) {
      return;
    }

    setIsGenerating(true);
    setSubmitError(null);

    try {
      const summary = await aiSummariesService.generateHistoricalSummary(patientId, {
        dateFrom: formatApiDate(selectedRange.from),
        dateUntil: formatApiDate(selectedRange.to),
      });

      onGenerated?.(summary);
      handleOpenChange(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al generar el resumen historico"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-3xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <CalendarRange className="size-5 text-[var(--brand-terciario)]" />
            Generar resumen clinico
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Selecciona el rango de fechas que quieres incluir en el resumen historico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--brand-acento)]/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Sparkles className="size-4 text-[var(--brand-secundario)]" />
              Rango seleccionado
            </div>
            <p className="text-sm text-slate-600">{formatRangeLabel(selectedRange)}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={selectedRange}
              defaultMonth={selectedRange?.from}
              onSelect={setSelectedRange}
              disabled={{ after: new Date() }}
              className="w-full"
            />
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 sm:grid sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isGenerating}
              className="w-full bg-white text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-full bg-brand-primario text-white hover:bg-brand-hover-primario cursor-pointer"
            onClick={handleGenerate}
            disabled={isSubmitDisabled}
            isLoading={isGenerating}
            loadingText="Generando..."
          >
            <Check className="size-4" />
            Generar resumen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateSummaryDialog;
