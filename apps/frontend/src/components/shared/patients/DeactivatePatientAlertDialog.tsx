import * as React from "react";

import { Button } from "@/components/common/Button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/common/alert-dialog";
import type { Patient } from "@/services/patients.service";

type DeactivatePatientAlertDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onConfirmDeactivate: (patientId: string) => Promise<void>;
};

export function DeactivatePatientAlertDialog({
  patient,
  open,
  onOpenChange,
  onConfirmDeactivate,
}: DeactivatePatientAlertDialogProps) {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setIsChecked(false);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [open]);

  const fullName = `${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim();

  const handleDeactivate = async () => {
    if (!patient || !isChecked || isSubmitting) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onConfirmDeactivate(String(patient.id));
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No se pudo desactivar el paciente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-rose-300 bg-rose-50 text-rose-950">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Desactivar paciente</AlertDialogTitle>
          <AlertDialogDescription className="text-rose-900/90">
            Esta acción desactivará al paciente
            {fullName ? ` (${fullName})` : ""}. No se eliminará el registro, pero
            quedara inactivo en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <label className="flex items-start gap-2 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-rose-900">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-rose-600"
            checked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
            disabled={isSubmitting}
          />
          Confirmo que deseo desactivar este paciente.
        </label>

        {submitError ? (
          <div className="rounded-md border border-rose-300 bg-white px-3 py-2 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}

        <AlertDialogFooter className="gap-3 sm:grid sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="w-full border-rose-300 bg-white text-rose-900 hover:bg-rose-100"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!isChecked || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Desactivando..."
            className="w-full bg-rose-600 text-white hover:bg-rose-700"
            onClick={handleDeactivate}
          >
            Desactivar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
