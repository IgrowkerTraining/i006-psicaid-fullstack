import * as React from "react";
import { format as formatDateFns } from "date-fns";
import { CalendarDays, Sparkles } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Calendar } from "@/components/common/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { treatmentsService, type CreateTreatmentDto, type Treatment } from "@/services/treatments.service";

import type { PatientTabPanelProps } from "./types";
import { PanelShell } from "./ui";

const emptyValues: CreateTreatmentDto = {
  content: "",
  date: "",
};

const parseDateValue = (value: string) => {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = new Date(isDateOnly ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value: string) => {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
};

const toTimestamp = (value: string) => {
  const parsed = parseDateValue(value);
  return parsed ? parsed.getTime() : 0;
};

type TreatmentsTabProps = PatientTabPanelProps & {
  createRequestKey?: number;
};

export function TreatmentsTab({ patient, createRequestKey }: TreatmentsTabProps) {
  const patientId = patient.profile.numericId;

  const [treatments, setTreatments] = React.useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [values, setValues] = React.useState<CreateTreatmentDto>(emptyValues);

  const loadTreatments = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await treatmentsService.getPatientTreatments(patientId);
      const sorted = [...data].sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
      setTreatments(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tratamientos");
      setTreatments([]);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  React.useEffect(() => {
    loadTreatments();
  }, [loadTreatments]);

  const lastCreateRequestKey = React.useRef(createRequestKey ?? 0);

  React.useEffect(() => {
    if (createRequestKey === undefined) {
      return;
    }

    if (createRequestKey !== lastCreateRequestKey.current) {
      setIsDialogOpen(true);
      lastCreateRequestKey.current = createRequestKey;
    }
  }, [createRequestKey]);

  const selectedDate = React.useMemo(() => {
    if (!values.date) {
      return undefined;
    }

    const parsed = parseDateValue(values.date);
    return parsed ?? undefined;
  }, [values.date]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    setValues((previous) => ({
      ...previous,
      date: formatDateFns(date, "yyyy-MM-dd"),
    }));
    setSubmitError(null);
    setDatePickerOpen(false);
  };

  const resetForm = React.useCallback(() => {
    setValues(emptyValues);
    setSubmitError(null);
    setIsSaving(false);
    setDatePickerOpen(false);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleCreate = async () => {
    if (!values.date || !values.content.trim() || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setSubmitError(null);

      await treatmentsService.createTreatment(patientId, {
        date: values.date,
        content: values.content.trim(),
      });

      setIsDialogOpen(false);
      resetForm();
      await loadTreatments();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo crear el tratamiento");
    } finally {
      setIsSaving(false);
    }
  };

  const isCreateDisabled = !values.date || !values.content.trim() || isSaving;

  if (isLoading) {
    return (
      <PanelShell>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Cargando tratamientos...</p>
        </div>
      </PanelShell>
    );
  }

  if (error) {
    return (
      <PanelShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </PanelShell>
    );
  }

  return (
    <PanelShell>
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-xl">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Nuevo tratamiento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-gray-800">Fecha</label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    className={`h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white transition-all duration-200 ${
                      values.date ? "text-slate-900" : "text-slate-400"
                    } ${
                      datePickerOpen ? "ring-2 ring-indigo-500/50 border-indigo-500" : ""
                    }`}
                  >
                    {selectedDate ? formatDateFns(selectedDate, "PPP") : ""}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto border-slate-200 bg-white p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate || new Date()}
                    onSelect={handleDateSelect}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-gray-800">Contenido</label>
              <textarea
                value={values.content}
                disabled={isSaving}
                onChange={(event) => {
                  setValues((previous) => ({ ...previous, content: event.target.value }));
                  setSubmitError(null);
                }}
                placeholder="Describe el tratamiento indicado..."
                className="min-h-[140px] w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                disabled={isSaving}
                className="w-full bg-brand-secundario text-gray-900 hover:bg-brand-hover-secundario cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreateDisabled}
              isLoading={isSaving}
              loadingText="Guardando..."
              className="w-full bg-brand-primario text-white hover:bg-brand-hover-primario cursor-pointer"
            >
              Guardar tratamiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {treatments.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <div className="mb-6 rounded-full bg-brand-gradient p-6">
              <Sparkles className="size-12 text-[var(--brand-secundario)]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">
              No hay tratamientos registrados
            </h3>
            <p className="max-w-md text-center text-sm text-slate-500">
              Aun no existen tratamientos para este paciente. Crea el primero para comenzar el seguimiento.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-3">
            {treatments.map((treatment, index) => (
              <article
                key={`${treatment.id ?? "treatment"}-${index}`}
                className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_10px_24px_rgba(9,2,36,0.05)]"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-terciario)]/25 bg-[var(--brand-terciario)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand-terciario)]">
                    <CalendarDays className="size-3.5" />
                    {formatDate(treatment.date)}
                  </span>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {treatment.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </PanelShell>
  );
}

export default TreatmentsTab;
