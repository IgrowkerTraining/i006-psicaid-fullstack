import * as React from "react";
import { format } from "date-fns";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Calendar } from "@/components/common/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/dialog";
import { Input } from "@/components/common/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { TimePicker } from "@/components/common/TimePicker";
import { sessionsService, type CreateSessionDto } from "@/services/sessions.service";

const SESSION_TYPES = ["Presencial", "Online", "Teleconsulta", "Domiciliaria"] as const;
const SESSION_FREQUENCIES = ["Semanal", "Quincenal", "Mensual"] as const;

type NewSessionDialogProps = {
  patientId: number;
  onSessionCreated: () => void;
};

const buildInitialValues = (): CreateSessionDto => ({
  sessionDateTime: new Date().toISOString(),
  sessionType: "Presencial",
  frequency: "Semanal",
  duration: 50,
  observations: "",
  hypothesis: "",
  interventions: "",
  clinicalEvolution: "",
  therapeuticGoals: "",
  diagnosticNotes: "",
});

export function NewSessionDialog({ patientId, onSessionCreated }: NewSessionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<CreateSessionDto>(buildInitialValues);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setValues(buildInitialValues());
      setSubmitError(null);
      setIsSaving(false);
      setDatePickerOpen(false);
    }
  };

  const selectedDate = React.useMemo(() => {
    const parsed = new Date(values.sessionDateTime);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [values.sessionDateTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    const current = new Date(values.sessionDateTime);
    date.setHours(current.getHours(), current.getMinutes(), 0, 0);
    setValues((prev) => ({ ...prev, sessionDateTime: date.toISOString() }));
    setDatePickerOpen(false);
  };

  const handleTimeChange = (time: string) => {
    if (!time) {
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(values.sessionDateTime);
    date.setHours(hours, minutes, 0, 0);
    setValues((prev) => ({ ...prev, sessionDateTime: date.toISOString() }));
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    setValues((prev) => ({
      ...prev,
      duration: Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0,
    }));
    setSubmitError(null);
  };

  const isSaveDisabled =
    !values.sessionDateTime ||
    !values.sessionType?.trim() ||
    !values.frequency?.trim() ||
    !values.duration ||
    values.duration <= 0;

  const handleSave = async () => {
    if (isSaveDisabled || isSaving) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);
    try {
      await sessionsService.createSession(patientId, values);
      handleOpenChange(false);
      onSessionCreated();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo crear la sesion."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-md bg-brand-primario px-4 text-white hover:bg-brand-hover-primario cursor-pointer">
          <Plus className="size-4" />
          Nueva sesion
        </Button>
      </DialogTrigger>

      <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-2xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-bold">Nueva sesion</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">Fecha</label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  className={`h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white transition-all duration-200 ${
                    datePickerOpen ? "border-indigo-500 ring-2 ring-indigo-500/50" : ""
                  } ${values.sessionDateTime ? "text-slate-900" : "text-slate-400"}`}
                >
                  {format(selectedDate, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-slate-200 bg-white p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">Hora</label>
            <div className="[&_button]:h-[42px] [&_button]:rounded-lg [&_button]:border-slate-300 [&_button]:bg-white [&_button]:px-3 [&_button]:text-base [&_button]:font-normal [&_button]:text-slate-900">
              <TimePicker
                value={format(selectedDate, "HH:mm")}
                onChange={handleTimeChange}
                disabled={isSaving}
              />
            </div>
          </div>

          <Input
            label="Duracion"
            type="number"
            min={1}
            step={5}
            value={values.duration ? String(values.duration) : ""}
            onChange={handleDurationChange}
            disabled={isSaving}
            placeholder="Ej: 50"
            className="h-[42px] bg-white"
          />

          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">Frecuencia</label>
            <select
              value={values.frequency}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, frequency: event.target.value }));
                setSubmitError(null);
              }}
              disabled={isSaving}
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {SESSION_FREQUENCIES.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full flex-col gap-1.5 sm:col-span-2">
            <label className="ml-1 text-sm font-medium text-gray-800">Tipo de sesion</label>
            <select
              value={values.sessionType}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, sessionType: event.target.value }));
                setSubmitError(null);
              }}
              disabled={isSaving}
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full flex-col gap-1.5 sm:col-span-2">
            <label className="ml-1 text-sm font-medium text-gray-800">Hipotesis</label>
            <textarea
              value={values.hypothesis || ""}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, hypothesis: event.target.value }));
                setSubmitError(null);
              }}
              disabled={isSaving}
              placeholder="Describe brevemente la hipotesis clinica..."
              className="min-h-[80px] w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex w-full flex-col gap-1.5 sm:col-span-2">
            <label className="ml-1 text-sm font-medium text-gray-800">Observaciones</label>
            <textarea
              value={values.observations || ""}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, observations: event.target.value }));
                setSubmitError(null);
              }}
              disabled={isSaving}
              placeholder="Describe brevemente las observaciones de la sesion..."
              className="min-h-[80px] w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
            className="w-full bg-brand-primario text-white hover:bg-brand-hover-primario cursor-pointer"
            onClick={handleSave}
            disabled={isSaveDisabled || isSaving}
            isLoading={isSaving}
            loadingText="Guardando..."
          >
            <Check className="size-4" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewSessionDialog;
