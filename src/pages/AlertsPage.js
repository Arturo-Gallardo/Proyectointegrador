import * as React from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { expenses } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { formatCurrency } from "lib/format";

const recurringAlerts = expenses
  .filter((expense) => expense.recurring)
  .map((expense) => ({
    id: `payment-${expense.id}`,
    type: "PAGO RECURRENTE",
    severity: "Próximo",
    variant: "secondary",
    message: `${expense.label}: ${formatCurrency(expense.amount)} vence el ${expense.dueDay} de julio.`,
    createdAt: "18/06/2026, 09:00",
  }));

const largestVariableExpense = expenses
  .filter((expense) => !expense.recurring)
  .sort((a, b) => b.amount - a.amount)[0];

const initialAlerts = [
  ...recurringAlerts,
  {
    id: `expense-${largestVariableExpense.id}`,
    type: "GASTO",
    severity: "Información",
    variant: "outline",
    message: `${largestVariableExpense.label}: gasto registrado por ${formatCurrency(largestVariableExpense.amount)}.`,
    createdAt: "18/06/2026, 08:30",
  },
];

export default function AlertsPage() {
  useDocumentTitle("Alertas");
  const [alerts, setAlerts] = React.useState(initialAlerts);
  const [pendingAlert, setPendingAlert] = React.useState(null);
  const [successOpen, setSuccessOpen] = React.useState(false);

  function confirmDelete() {
    if (!pendingAlert) return;
    setAlerts((items) => items.filter((item) => item.id !== pendingAlert.id));
    setPendingAlert(null);
    setSuccessOpen(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Alertas</h1>
        <p className="text-sm text-muted-foreground">
          Avisos generados a partir de tus gastos y pagos recurrentes
          registrados.
        </p>
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Flujo de alertas</CardTitle>
          <CardDescription>
            {alerts.length} alertas activas que pueden requerir tu atención.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="w-[80px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {alert.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.variant}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md text-sm">
                    {alert.message}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {alert.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPendingAlert(alert)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">
                        Eliminar alerta {alert.type}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!alerts.length ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No tienes alertas activas.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingAlert)}
        onOpenChange={(open) => !open && setPendingAlert(null)}
        title="¿Eliminar alerta ejemplo?"
        description="Se quitará de la lista."
        confirmLabel="Eliminar alerta"
        destructive
        onConfirm={confirmDelete}
      />
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Alerta eliminada"
        description="La alerta ha sido eliminada."
      />
    </div>
  );
}
