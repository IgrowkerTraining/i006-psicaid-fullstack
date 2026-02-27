import * as React from "react";
import { format } from "date-fns";
import { CalendarClock, Check, Plus } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Calendar } from "@/components/common/calendar";
import { TimePicker } from "@/components/common/TimePicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { sessionsService, type CreateSessionDto } from "@/services/sessions.service";

const SESSION_TYPES = ["Presencial", "Teleconsulta", "Domiciliaria"] as const;

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
    if (!date) return;
    const current = new Date(values.sessionDateTime);
    date.setHours(current.getHours(), current.getMinutes());
    setValues((prev) => ({ ...prev, sessionDateTime: date.toISOString() }));
    setDatePickerOpen(false);
  };

  const handleTimeChange = (time: string) => {
    if (!time) return;
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(values.sessionDateTime);
    date.setHours(hours, minutes);
    setValues((prev) => ({ ...prev, sessionDateTime: date.toISOString() }));
  };

  const isSaveDisabled = !values.sessionDateTime || !values.sessionType;

  const handleSave = async () => {
    if (isSaveDisabled || isSaving) return;

    setIsSaving(true);
    setSubmitError(null);
    try {
      await sessionsService.createSession(patientId, values);
      onSessionCreated();
      handleOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al crear la sesión");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-brand-primario px-4 text-white hover:bg-brand-hover-primario cursor-pointer">
          <Plus className="size-4" />
          Nueva sesión
        </Button>
      </DialogTrigger>

      <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-md">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Nueva sesión
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Fecha */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">
              Fecha *
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  className={`h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white transition-all duration-200 text-slate-900 ${
                    datePickerOpen ? "ring-2 ring-indigo-500/50 border-indigo-500" : ""
                  }`}
                >
                  <CalendarClock className="size-4 text-slate-400" />
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

          {/* Hora */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">
              Hora *
            </label>
            <TimePicker
              value={format(selectedDate, "HH:mm")}
              onChange={handleTimeChange}
              disabled={isSaving}
            />
          </div>

          {/* Modalidad */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-gray-800">
              Modalidad *
            </label>
            <select
              value={values.sessionType}
              onChange={(e) => setValues((prev) => ({ ...prev, sessionType: e.target.value }))}
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
              disabled={isSaving}
              className="w-full bg-white text-gray-900 hover:bg-gray-50 cursor-pointer"
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
