import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CalendarClock, Clock, ArrowLeft, Save, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Calendar } from '@/components/common/calendar';
import { TimePicker } from '@/components/common/TimePicker';
import { DurationPicker } from '@/components/common/DurationPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { sessionsService, type CreateSessionDto } from '@/services/sessions.service';
import { ROUTES } from '@/constants/routes';

const SESSION_TYPES = ['Presencial', 'Teleconsulta', 'Domiciliaria'] as const;
const FREQUENCY_OPTIONS = ['Semanal', 'Quincenal', 'Mensual', 'Esporádica'] as const;

const extractNumericId = (idOrCode: string | number | undefined): number => {
  if (typeof idOrCode === "number") return idOrCode;
  if (!idOrCode) return 0;
  
  // If it's in PSI format, extract the numeric part
  const match = String(idOrCode).match(/PSI-PCT-\d+-(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  // Otherwise try to parse as number
  const parsed = parseInt(String(idOrCode), 10);
  return isNaN(parsed) ? 0 : parsed;
};

const SessionNew: React.FC = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const numericPatientId = extractNumericId(patientId);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Capturar datos del paciente del location.state si existen
  const patient = (location.state as any)?.patient || null;

  const [formValues, setFormValues] = useState<CreateSessionDto>({
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
  });

  const handleInputChange = (field: keyof CreateSessionDto) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormValues(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError(null);
    };
  };

  const handleDurationChange = (duration: number) => {
    setFormValues(prev => ({
      ...prev,
      duration,
    }));
    setError(null);
  };

  const selectedDate = React.useMemo(() => {
    if (!formValues.sessionDateTime) {
      return undefined;
    }
    const parsed = new Date(formValues.sessionDateTime);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [formValues.sessionDateTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    // Mantener la hora actual si ya existe
    const currentDate = new Date(formValues.sessionDateTime);
    date.setHours(currentDate.getHours(), currentDate.getMinutes());
    
    setFormValues(prev => ({
      ...prev,
      sessionDateTime: date.toISOString(),
    }));
    setDatePickerOpen(false);
  };

  const handleTimeChange = (time: string) => {
    // time ya viene en formato "HH:mm" desde el TimePicker
    if (!time) return;

    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(formValues.sessionDateTime);
    date.setHours(hours, minutes);

    setFormValues(prev => ({
      ...prev,
      sessionDateTime: date.toISOString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await sessionsService.createSession(numericPatientId, formValues);
      navigate(ROUTES.PATIENT_DETAIL.replace(':id', patientId), {
        state: { patient }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeForInput = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, 'HH:mm');
  };

  return (
    <div className="min-h-screen bg-[#e8ebf9]">
      <div className="mx-auto max-w-5xl w-full px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(ROUTES.PATIENT_DETAIL.replace(':id', patientId || ''), {
            state: { patient }
          })}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--brand-primario)] transition-colors hover:text-[var(--brand-hover-primario)] cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Volver al perfil del paciente
        </button>

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--brand-primario)] mb-2">
            Registrar Nueva Sesión Clínica
          </h1>
          <p className="text-gray-600 text-sm">
            Completa los datos de la sesión terapéutica
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadatos de la sesión */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--brand-primario)] mb-4 flex items-center gap-2">
              <CalendarClock className="size-5 text-[var(--brand-secundario)]" />
              Datos de la sesión
            </h3>
            
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
                      disabled={isSubmitting}
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
                <TimePicker
                  value={formatTimeForInput(formValues.sessionDateTime)}
                  onChange={handleTimeChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Duración (min)
                </label>
                <DurationPicker
                  value={formValues.duration}
                  onChange={handleDurationChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="ml-1 text-sm font-medium text-slate-600 block mb-1.5">
                  Tipo de sesión
                </label>
                <select
                  value={formValues.sessionType}
                  onChange={handleInputChange('sessionType')}
                  disabled={isSubmitting}
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
                  value={formValues.frequency}
                  onChange={handleInputChange('frequency')}
                  disabled={isSubmitting}
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--brand-primario)] mb-4 flex items-center gap-2">
              <Stethoscope className="size-5 text-[var(--brand-terciario)]" />
              Narrativa clínica
            </h3>

            <div className="space-y-4">
              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Observaciones clínicas
                </label>
                <textarea
                  value={formValues.observations}
                  onChange={handleInputChange('observations')}
                  placeholder="Observaciones sobre el estado del paciente, conducta, emociones..."
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Hipótesis clínica
                </label>
                <textarea
                  value={formValues.hypothesis}
                  onChange={handleInputChange('hypothesis')}
                  placeholder="Hipótesis o supuestos clínicos tras la sesión..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Intervenciones terapéuticas
                </label>
                <textarea
                  value={formValues.interventions}
                  onChange={handleInputChange('interventions')}
                  placeholder="Técnicas, ejercicios o intervenciones aplicadas..."
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Evolución clínica
                </label>
                <textarea
                  value={formValues.clinicalEvolution}
                  onChange={handleInputChange('clinicalEvolution')}
                  placeholder="Progreso observado desde sesiones anteriores..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Objetivos terapéuticos
                </label>
                <textarea
                  value={formValues.therapeuticGoals}
                  onChange={handleInputChange('therapeuticGoals')}
                  placeholder="Metas acordadas para el proceso terapéutico..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="ml-1 text-sm font-medium text-slate-600">
                  Notas diagnósticas
                </label>
                <textarea
                  value={formValues.diagnosticNotes}
                  onChange={handleInputChange('diagnosticNotes')}
                  placeholder="Impresiones diagnósticas adicionales..."
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--brand-secundario)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-secundario)]/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.PATIENT_DETAIL.replace(':id', patientId || ''), {
                state: { patient }
              })}
              disabled={isSubmitting}
              className="rounded-xl border-[var(--brand-primario)]/20 bg-[var(--brand-secundario)] text-[var(--brand-primario)] hover:bg-[var(--brand-hover-secundario)] hover:text-[var(--brand-primario)] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--brand-primario)] text-white hover:bg-[var(--brand-hover-primario)] active:bg-[var(--brand-active-primario)] cursor-pointer"
            >
              <Save className="size-4" />
              {isSubmitting ? 'Guardando...' : 'Guardar sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionNew;

