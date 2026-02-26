import * as React from 'react';
import { format } from 'date-fns';
import {
  CalendarHeart,
  Check,
  Mail,
  Phone,
  Plus,
  Stethoscope,
  User,
} from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Calendar } from '@/components/common/calendar';
import { Input } from '@/components/common/Input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/common/popover';
import type { CreatePatientDto } from '@/services/patients.service';

export type NewPatientFormValues = CreatePatientDto;

type NewPatientDialogProps = {
  onSave: (values: NewPatientFormValues) => Promise<void>;
};

const emptyFormValues: NewPatientFormValues = {
  firstName: '',
  lastName: '',
  birthDate: '',
  occupation: '',
  maritalStatus: '',
  sex: '',
  email: '',
  phone: '',
  reasonConsultation: '',
};

const MARITAL_STATUS_OPTIONS = [
  'Soltero',
  'Casado',
  'Divorciado',
  'Viudo',
  'Union libre',
  'Separado',
] as const;

const SEX_OPTIONS = [
  'Masculino',
  'Femenino',
  'Prefiero no decirlo',
] as const;

export function NewPatientDialog({ onSave }: NewPatientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [birthDatePickerOpen, setBirthDatePickerOpen] = React.useState(false);
  const [values, setValues] = React.useState<NewPatientFormValues>(emptyFormValues);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleFieldChange = (field: keyof NewPatientFormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
      setSubmitError(null);
    };
  };

  const handleSelectChange = (
    field: Extract<keyof NewPatientFormValues, 'maritalStatus' | 'sex'>
  ) => {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
      setSubmitError(null);
    };
  };

  const selectedBirthDate = React.useMemo(() => {
    if (!values.birthDate) {
      return undefined;
    }

    const parsed = new Date(`${values.birthDate}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [values.birthDate]);

  const handleBirthDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    setValues((previous) => ({
      ...previous,
      birthDate: format(date, 'yyyy-MM-dd'),
    }));
    setSubmitError(null);
    setBirthDatePickerOpen(false);
  };

  const resetForm = () => {
    setValues(emptyFormValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
      setSubmitError(null);
      setIsSaving(false);
      setBirthDatePickerOpen(false);
    }
  };

  const isSaveDisabled = !values.firstName.trim() || !values.lastName.trim() || !values.birthDate || !values.occupation.trim() || !values.maritalStatus || !values.sex;

  const handleSave = async () => {
    if (isSaveDisabled || isSaving) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);
    try {
      await onSave(values);
      resetForm();
      setOpen(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No se pudo crear el paciente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-brand-primario px-6 text-white hover:bg-brand-hover-primario cursor-pointer">
          <Plus className="size-4" />
          Nuevo Paciente
        </Button>
      </DialogTrigger>

      <DialogContent className="border-gray-200 bg-brand-acento text-gray-700 sm:max-w-2xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl font-bold">
            Agregar paciente
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Completa los datos para registrar el paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            placeholder="Ej: Joseph"
            value={values.firstName}
            onChange={handleFieldChange('firstName')}
            icon={<User className="size-4" />}
          />
          <Input
            label="Apellido"
            placeholder="Ej: Vilanova"
            value={values.lastName}
            onChange={handleFieldChange('lastName')}
            icon={<User className="size-4" />}
          />
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-slate-400">
              Fecha de nacimiento
            </label>
            <Popover open={birthDatePickerOpen} onOpenChange={setBirthDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  className={`h-[42px] w-full justify-start border-slate-300 bg-white text-left font-normal hover:bg-white ${
                    values.birthDate ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  <CalendarHeart className="size-4" />
                  {selectedBirthDate
                    ? format(selectedBirthDate, 'PPP')
                    : 'Selecciona una fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto border-slate-200 bg-white p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedBirthDate}
                  defaultMonth={selectedBirthDate || new Date(new Date().getFullYear() - 20, 0)}
                  captionLayout="dropdown"
                  startMonth={new Date(1930, 0)}
                  endMonth={new Date(new Date().getFullYear() - 5, 11, 31)}
                  onSelect={handleBirthDateSelect}
                  disabled={(date) => {
                    const fiveYearsAgo = new Date();
                    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
                    return date > fiveYearsAgo;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Input
            label="Ocupacion"
            placeholder="Ej: Ingeniero"
            value={values.occupation}
            onChange={handleFieldChange('occupation')}
            icon={<Stethoscope className="size-4" />}
          />
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-slate-400">Sexo</label>
            <select
              value={values.sex}
              onChange={handleSelectChange('sex')}
              disabled={isSaving}
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="" disabled>
                Selecciona sexo
              </option>
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-slate-400">
              Estado civil
            </label>
            <select
              value={values.maritalStatus}
              onChange={handleSelectChange('maritalStatus')}
              disabled={isSaving}
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="" disabled>
                Selecciona estado civil
              </option>
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Email"
            placeholder="ejemplo@email.com"
            type="email"
            value={values.email || ''}
            onChange={handleFieldChange('email')}
            icon={<Mail className="size-4" />}
          />
          <Input
            label="Telefono"
            placeholder="+56 9 1234 5678"
            value={values.phone || ''}
            onChange={handleFieldChange('phone')}
            icon={<Phone className="size-4" />}
          />
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <label className="ml-1 text-sm font-medium text-slate-400">
            Motivo de consulta
          </label>
          <textarea
            value={values.reasonConsultation || ''}
            onChange={(e) => {
              setValues((prev) => ({...prev, reasonConsultation: e.target.value}));
              setSubmitError(null);
            }}
            disabled={isSaving}
            placeholder="Describe el motivo de la consulta..."
            className="min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
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
              className="w-full  bg-brand-secundario text-gray-900 hover:bg-brand-hover-secundario cursor-pointer"
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
