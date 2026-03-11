import * as React from "react";
import { format } from "date-fns";
import { CalendarHeart, Check, Mail, Phone, Stethoscope, User } from "lucide-react";

// TODO BACKEND: Error JDBC al actualizar pacientes
// "prepared statement S_4 already exists"
// Revisar manejo de conexiones/transacciones en PatientService
// También configurar Jackson con PropertyNamingStrategies.SNAKE_CASE
// para evitar conversión manual de field names

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
import type { Patient, UpdatePatientDto } from "@/services/patients.service";

type EditPatientDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onConfirmUpdate: (patientId: string, values: UpdatePatientDto) => Promise<void>;
};

const emptyValues: UpdatePatientDto = {
  firstName: "",
  lastName: "",
  birthDate: "",
  occupation: "",
  maritalStatus: "",
  sex: "",
  email: "",
  phone: "",
  reasonConsultation: "",
};

const MARITAL_STATUS_OPTIONS = [
  "Soltero",
  "Casado",
  "Viudo",
] as const;

const SEX_OPTIONS = ["Masculino", "Femenino", "Prefiero no decirlo"] as const;

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
  onConfirmUpdate,
}: EditPatientDialogProps) {
  const [values, setValues] = React.useState<UpdatePatientDto>(emptyValues);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [birthDatePickerOpen, setBirthDatePickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open || !patient) {
      return;
    }

    setValues({
      firstName: patient.firstName ?? "",
      lastName: patient.lastName ?? "",
      birthDate: patient.birthDate ?? "",
      occupation: patient.occupation ?? "",
      maritalStatus: patient.maritalStatus ?? "",
      sex: patient.sex ?? "",
      email: patient.email ?? "",
      phone: patient.phone ?? "",
      // Backend devuelve reason_consultation (snake_case)
      reasonConsultation: patient.reasonConsultation ?? patient.reason_consultation ?? "",
    });
    setSubmitError(null);
    setConfirmOpen(false);
    setBirthDatePickerOpen(false);
    setIsSaving(false);
  }, [open, patient]);

  const handleFieldChange = (field: keyof UpdatePatientDto) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
      setSubmitError(null);
    };
  };

  const handleSelectChange = (
    field: Extract<keyof UpdatePatientDto, "maritalStatus" | "sex">
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
      birthDate: format(date, "yyyy-MM-dd"),
    }));
    setSubmitError(null);
    setBirthDatePickerOpen(false);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setSubmitError(null);
      setConfirmOpen(false);
      setBirthDatePickerOpen(false);
      setIsSaving(false);
    }
  };

  const isSaveDisabled = !values.firstName.trim() || !values.lastName.trim() || !values.birthDate || !values.occupation.trim() || !values.maritalStatus || !values.sex;

  const handleConfirmUpdate = async () => {
    if (!patient || isSaveDisabled || isSaving) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);
    try {
      await onConfirmUpdate(String(patient.id), values);
      setConfirmOpen(false);
      handleDialogOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo actualizar el paciente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="border-gray-200 bg-white text-gray-700 sm:max-w-2xl">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold">
              Editar paciente
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Actualiza la informacion basica del paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              value={values.firstName}
              onChange={handleFieldChange("firstName")}
              icon={<User className="size-4" />}
            />
            <Input
              label="Apellido"
              value={values.lastName}
              onChange={handleFieldChange("lastName")}
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
                      values.birthDate ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    <CalendarHeart className="size-4" />
                    {selectedBirthDate
                      ? format(selectedBirthDate, "PPP")
                      : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-slate-200 bg-white p-0" align="start">
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
              value={values.occupation}
              onChange={handleFieldChange("occupation")}
              icon={<Stethoscope className="size-4" />}
            />
            <div className="flex w-full flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-slate-400">Sexo</label>
              <select
                value={values.sex}
                onChange={handleSelectChange("sex")}
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
                onChange={handleSelectChange("maritalStatus")}
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
              label="Teléfono"
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
                className="w-full rounded-md  bg-brand-secundario text-gray-900 hover:bg-brand-hover-secundario cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isSaveDisabled || isSaving}
              className="w-full bg-brand-primario text-white hover:bg-brand-hover-primario cursor-pointer"
              onClick={() => setConfirmOpen(true)}
            >
              <Check className="size-4" />
              Modificar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-amber-300 bg-amber-50 text-amber-950">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Confirmar actualización</AlertDialogTitle>
            <AlertDialogDescription className="text-amber-900/90">
              Estas a punto de actualizar la información básica del paciente.
              Esta acción guardara cambios en la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:grid sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              className="w-full border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              onClick={() => setConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              isLoading={isSaving}
              loadingText="Actualizando..."
              className="w-full bg-amber-600 text-white hover:bg-amber-700"
              onClick={handleConfirmUpdate}
            >
              Sí, continuar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
