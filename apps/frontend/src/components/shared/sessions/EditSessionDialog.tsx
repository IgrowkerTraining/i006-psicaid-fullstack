import * as React from "react";
import { format } from "date-fns";
import { CalendarClock, Clock, Check, Stethoscope } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Calendar } from "@/components/common/calendar";
import { Input } from "@/components/common/Input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/common/alert-dialog";
import type { ClinicalSession, UpdateSessionDto } from "@/services/sessions.service";

const SESSION_TYPES = ['Presencial', 'Teleconsulta', 'Domiciliaria'] as const;
const FREQUENCY_OPTIONS = ['Semanal', 'Quincenal', 'Mensual', 'Esporádica'] as const;

type EditSessionDialogProps = {
  session: ClinicalSession | null;
  patientId: number;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onConfirmUpdate: (sessionId: number, values: UpdateSessionDto) => Promise<void>;
};

const emptyValues: UpdateSessionDto = {
  sessionDateTime: new Date().toISOString(),
  sessionType: 'Presencial',
  frequency: 'Semanal',
  duration: 50,
  observations: '',
  hypothesis: '',
  interventions: '',
  clinicalEvolution: '',
  therapeuticGoals: '',
  diagnosticNotes: '',
};

export function EditSessionDialog({
  session,
  patientId,
  open,
  onOpenChange,
  onConfirmUpdate,
}: EditSessionDialogProps) {
  const [values, setValues] = React.useState<UpdateSessionDto>(emptyValues);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open || !session) {
      return;
    }

    setValues({
      sessionDateTime: session.sessionDateTime,
      sessionType: session.sessionType || 'Presencial',
      frequency: session.frequency || 'Semanal',
      duration: session.duration || 50,
      observations: session.observations || '',
      hypothesis: session.hypothesis || '',
      interventions: session.interventions || '',
      clinicalEvolution: session.clinicalEvolution || '',
      therapeuticGoals: session.therapeuticGoals || '',
      diagnosticNotes: session.diagnosticNotes || '',
    });
    setSubmitError(null);
    setConfirmOpen(false);
    setDatePickerOpen(false);
    setIsSaving(false);
  }, [open, session]);

  const handleInputChange = (field: keyof UpdateSessionDto) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
      setSubmitError(null);
    };
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    setValues(prev => ({
      ...prev,
      duration: value,
    }));
    setSubmitError(null);
  };

  const selectedDate = React.useMemo(() => {
    if (!values.sessionDateTime) {
      return undefined;
    }
    const parsed = new Date(values.sessionDateTime);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [values.sessionDateTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !values.sessionDateTime) {
      return;
    }

    const currentDate = new Date(values.sessionDateTime);
    date.setHours(currentDate.getHours(), currentDate.getMinutes());
    
    setValues(prev => ({
      ...prev,
      sessionDateTime: date.toISOString(),
    }));
    setDatePickerOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time || !values.sessionDateTime) return;

    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(values.sessionDateTime);
    date.setHours(hours, minutes);

    setValues(prev => ({
      ...prev,
      sessionDateTime: date.toISOString(),
    }));
  };

  const formatTimeForInput = (isoString: string | undefined) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return format(date, 'HH:mm');
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setSubmitError(null);
      setConfirmOpen(false);
      setDatePickerOpen(false);
      setIsSaving(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!session || isSaving) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);
    try {
      await onConfirmUpdate(session.id, values);
      setConfirmOpen(false);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo actualizar la sesión."
      );
      setConfirmOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="border-gray-200 bg-brand-acento text-gray-700 sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold">
              Editar sesión clínica
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Modifica los datos de la sesión terapéutica
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Metadatos */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--brand-primario)] mb-3">
                Datos de la sesión
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Fecha *
                  </label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSaving}
                        className="h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white text-slate-900"
                      >
                        <CalendarClock className="size-4" />
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Seleccionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date('1900-01-01')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Hora *
                  </label>
                  <Input
                    type="time"
                    value={formatTimeForInput(values.sessionDateTime)}
                    onChange={handleTimeChange}
                    icon={<Clock className="size-4" />}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Duración (min)
                  </label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={values.duration || ''}
                    onChange={handleDurationChange}
                    icon={<Clock className="size-4" />}
                    disabled={isSaving}
                  />
                </div>
              </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="ml-1 text-sm font-medium text-slate-600 block mb-1.5">
                  Tipo de sesión
                </label>
                <select
                  value={values.sessionType}
                  onChange={handleInputChange('sessionType')}
                  disabled={isSaving}
                  className="w-full h-[42px] rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20"
                >
                  {SESSION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ml-1 text-sm font-medium text-slate-600 block mb-1.5">
                  Frecuencia
                </label>
                <select
                  value={values.frequency}
                  onChange={handleInputChange('frequency')}
                  disabled={isSaving}
                  className="w-full h-[42px] rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20"
                >
                  {FREQUENCY_OPTIONS.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Narrativa clínica */}
          <div>
              <h4 className="text-sm font-semibold text-[var(--brand-primario)] mb-3">
                Narrativa clínica
              </h4>
              <div className="space-y-4">
                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Observaciones
                  </label>
                  <textarea
                    value={values.observations}
                    onChange={handleInputChange('observations')}
                    placeholder="Observaciones sobre el estado del paciente..."
                    disabled={isSaving}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Hipótesis
                  </label>
                  <textarea
                    value={values.hypothesis}
                    onChange={handleInputChange('hypothesis')}
                    placeholder="Hipótesis clínica..."
                    disabled={isSaving}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Intervenciones
                  </label>
                  <textarea
                    value={values.interventions}
                    onChange={handleInputChange('interventions')}
                    placeholder="Técnicas o intervenciones aplicadas..."
                    disabled={isSaving}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Evolución clínica
                  </label>
                  <textarea
                    value={values.clinicalEvolution}
                    onChange={handleInputChange('clinicalEvolution')}
                    placeholder="Progreso desde sesiones anteriores..."
                    disabled={isSaving}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Objetivos terapéuticos
                  </label>
                  <textarea
                    value={values.therapeuticGoals}
                    onChange={handleInputChange('therapeuticGoals')}
                    placeholder="Metas acordadas..."
                    disabled={isSaving}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-600">
                    Notas diagnósticas
                  </label>
                  <textarea
                    value={values.diagnosticNotes}
                    onChange={handleInputChange('diagnosticNotes')}
                    placeholder="Impresiones diagnósticas..."
                    disabled={isSaving}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                className="rounded-xl"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => setConfirmOpen(true)}
              className="rounded-xl bg-[var(--brand-secundario)] hover:bg-[var(--brand-secundario)]/90 text-white"
            >
              <Check className="size-4" />
              {isSaving ? "Actualizando..." : "Actualizar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-gray-200 bg-brand-acento">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--brand-primario)]">
              ¿Confirmar actualización?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Los cambios se guardarán en el historial clínico del paciente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSaving}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              disabled={isSaving}
              className="rounded-xl bg-[var(--brand-secundario)] hover:bg-[var(--brand-secundario)]/90 text-white"
            >
              {isSaving ? "Actualizando..." : "Confirmar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
