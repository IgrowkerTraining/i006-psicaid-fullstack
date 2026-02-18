import * as React from 'react';
import {
  CalendarHeart,
  Check,
  Mail,
  Phone,
  Plus,
  Stethoscope,
  User,
  UserRoundPlus,
} from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/common/alert-dialog';

export type NewPatientFormValues = {
  fullName: string;
  age: string;
  consultationReason: string;
  contactPhone: string;
  email: string;
  diagnosis: string;
};

type NewPatientDialogProps = {
  onSave: (values: NewPatientFormValues) => void;
};

const emptyFormValues: NewPatientFormValues = {
  fullName: '',
  age: '',
  consultationReason: '',
  contactPhone: '',
  email: '',
  diagnosis: '',
};

export function NewPatientDialog({ onSave }: NewPatientDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<NewPatientFormValues>(emptyFormValues);

  const handleFieldChange = (field: keyof NewPatientFormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };
  };

  const resetForm = () => {
    setValues(emptyFormValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSave = () => {
    if (!values.fullName.trim()) {
      return;
    }

    onSave(values);
    resetForm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button className="rounded-xl bg-indigo-600 px-6 text-white hover:bg-indigo-700">
          <Plus className="size-4" />
          Nuevo Paciente
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-2xl">
        <AlertDialogHeader className="space-y-2 text-left">
          <AlertDialogMedia className="hidden border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 sm:inline-flex">
            <UserRoundPlus className="size-7" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-2xl font-bold">
            Nuevo paciente
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Completa los datos para registrar el paciente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre completo"
            placeholder="Ej: Ana Morales"
            value={values.fullName}
            onChange={handleFieldChange('fullName')}
            icon={<User className="size-4" />}
          />
          <Input
            label="Edad"
            type="number"
            min={0}
            placeholder="Ej: 29"
            value={values.age}
            onChange={handleFieldChange('age')}
            icon={<CalendarHeart className="size-4" />}
          />
          <Input
            label="Motivo de consulta"
            placeholder="Ej: Crisis de ansiedad"
            value={values.consultationReason}
            onChange={handleFieldChange('consultationReason')}
            icon={<Stethoscope className="size-4" />}
          />
          <Input
            label="Telefono de contacto"
            placeholder="Ej: +1 555 123 4567"
            value={values.contactPhone}
            onChange={handleFieldChange('contactPhone')}
            icon={<Phone className="size-4" />}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Ej: paciente@email.com"
            value={values.email}
            onChange={handleFieldChange('email')}
            icon={<Mail className="size-4" />}
          />
          <div className="sm:col-span-2">
            <Input
              label="Diagnostico"
              placeholder="Ej: Trastorno de ansiedad generalizada"
              value={values.diagnosis}
              onChange={handleFieldChange('diagnosis')}
              icon={<Stethoscope className="size-4" />}
            />
          </div>
        </div>

        <AlertDialogFooter className="mt-2 gap-3 sm:grid sm:grid-cols-2">
          <AlertDialogCancel className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-slate-100">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleSave}
            disabled={!values.fullName.trim()}
          >
            <Check className="size-4" />
            Guardar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
