import * as React from "react";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";

const DEFAULT_FORM_SUCCESS = {
  title: "Guardado correctamente",
  description: "Los cambios se aplicaron.",
};

const DEFAULT_DELETE_SUCCESS = {
  title: "Eliminado",
  description: "El registro se eliminó correctamente.",
};

/**
 * Opens form/confirm dialogs and success feedback — UI only, no persistence.
 */
export function usePrototypeCrudUi() {
  const [formOpen, setFormOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const pendingSuccessRef = React.useRef(DEFAULT_FORM_SUCCESS);

  const [formConfig, setFormConfig] = React.useState({
    title: "",
    description: "",
    fields: [],
    submitLabel: "Guardar",
  });

  const [confirmConfig, setConfirmConfig] = React.useState({
    title: "",
    description: "",
    confirmLabel: "Eliminar",
    destructive: true,
  });

  const [successConfig, setSuccessConfig] = React.useState(DEFAULT_FORM_SUCCESS);

  const showSuccess = React.useCallback((config = {}) => {
    setSuccessConfig({
      title: config.title ?? DEFAULT_FORM_SUCCESS.title,
      description: config.description ?? DEFAULT_FORM_SUCCESS.description,
    });
    setSuccessOpen(true);
  }, []);

  const openForm = React.useCallback((config) => {
    pendingSuccessRef.current = config.success ?? DEFAULT_FORM_SUCCESS;
    setFormConfig({
      title: config.title,
      description: config.description ?? "",
      fields: config.fields ?? [],
      submitLabel: config.submitLabel ?? "Guardar",
    });
    setFormOpen(true);
  }, []);

  const openConfirm = React.useCallback((config) => {
    const resolved =
      typeof config === "string" ? { itemLabel: config } : config;

    pendingSuccessRef.current = resolved.success ?? DEFAULT_DELETE_SUCCESS;
    setConfirmConfig({
      title:
        resolved.title ??
        `¿Eliminar ${resolved.itemLabel ?? "este registro"}?`,
      description:
        resolved.description ??
        "Esta acción no se puede deshacer.",
      confirmLabel: resolved.confirmLabel ?? "Eliminar",
      destructive: resolved.destructive ?? true,
    });
    setConfirmOpen(true);
  }, []);

  const handleFormSubmit = React.useCallback(() => {
    showSuccess(pendingSuccessRef.current);
  }, [showSuccess]);

  const handleConfirm = React.useCallback(() => {
    showSuccess(pendingSuccessRef.current);
  }, [showSuccess]);

  const dialogs = (
    <>
      <PrototypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={formConfig.title}
        description={formConfig.description}
        fields={formConfig.fields}
        submitLabel={formConfig.submitLabel}
        onSubmit={handleFormSubmit}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmLabel={confirmConfig.confirmLabel}
        destructive={confirmConfig.destructive}
        onConfirm={handleConfirm}
      />
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successConfig.title}
        description={successConfig.description}
      />
    </>
  );

  return {
    openForm,
    openConfirm,
    showSuccess,
    dialogs,
  };
}
