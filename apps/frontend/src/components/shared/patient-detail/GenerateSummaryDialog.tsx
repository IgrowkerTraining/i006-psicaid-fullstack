import * as React from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Check } from "lucide-react";
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

const formatInputDate = (value: Date | undefined) => {
  if (!value) {
    return "";
  }

  return format(value, "dd/MM/yyyy", { locale: es });
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
      <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-2xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-bold">Generar resumen asistido</DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            Seleccione un periodo de sesiones para resumir.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">Desde</label>
            <input
              type="text"
              value={formatInputDate(selectedRange?.from)}
              readOnly
              placeholder="dd/mm/aaaa"
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">Hasta</label>
            <input
              type="text"
              value={formatInputDate(selectedRange?.to)}
              readOnly
              placeholder="dd/mm/aaaa"
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="sm:col-span-2">
            <Calendar
              mode="range"
              numberOfMonths={2}
              captionLayout="dropdown"
              selected={selectedRange}
              defaultMonth={selectedRange?.from}
              onSelect={setSelectedRange}
              disabled={{ after: new Date() }}
              className="w-full rounded-lg bg-transparent p-0"
              classNames={{
                root: "w-full",
                months: "grid gap-4 md:grid-cols-2",
                month:
                  "relative min-w-0 rounded-2xl border border-slate-200 bg-white px-4 pb-4 pt-4 shadow-[0_6px_18px_rgba(9,2,36,0.04)]",
                month_caption: "mb-3 flex h-8 items-center justify-center px-10",
                nav: "absolute left-4 right-4 top-4 flex items-center justify-between",
                dropdowns:
                  "w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-900",
                dropdown_root:
                  "relative rounded-md border border-slate-200 bg-white shadow-none has-focus:ring-2 has-focus:ring-indigo-500/40",
                weekday:
                  "text-slate-400 rounded-md flex-1 text-[0.72rem] font-normal select-none",
                week: "mt-1 flex w-full",
                table: "w-full border-collapse",
              }}
            />
          </div>
        </div>

        {submitError ? (
          <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <DialogFooter className="mt-2 gap-3 sm:grid sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isGenerating}
              className="w-full bg-brand-secundario text-gray-900 hover:bg-brand-hover-secundario cursor-pointer"
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
