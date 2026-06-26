import * as React from "react";
import { CalendarClock, CircleDollarSign, Plus, WalletCards } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { incomeEntries as seedIncome } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { usePrototypeCrudUi } from "hooks/usePrototypeCrudUi";
import { INCOME_CHANNEL_LABELS } from "lib/app";
import { createCrudHandlers } from "lib/formSchemas";
import { formatCurrency } from "lib/format";

const channels = Object.keys(INCOME_CHANNEL_LABELS);

export default function IncomePage() {
  useDocumentTitle("Ingresos");
  const crud = usePrototypeCrudUi();
  const incomeCrud = createCrudHandlers(crud, "income");
  const [rows, setRows] = React.useState(seedIncome);
  const [label, setLabel] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [channel, setChannel] = React.useState(channels[0]);
  const [date, setDate] = React.useState("2026-06-18");

  function addIncome(event) {
    event.preventDefault();
    if (!label.trim() || !amount || !date) return;
    setRows((items) => [
      {
        id: `local-${Date.now()}`,
        label: label.trim(),
        channel,
        amount: Number(amount),
        date,
      },
      ...items,
    ]);
    setLabel("");
    setAmount("");
    crud.showSuccess({
      title: "Ingreso registrado",
      description:
        "El ingreso se ha registrado y ya forma parte de los cálculos financieros.",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de ingresos
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra el dinero que recibes y entiende de dónde viene.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FinanceMetricCard
          icon={CircleDollarSign}
          label="Ingreso anual"
          value="$297,600"
          detail="Ingreso anual calculado con base en ingresos registrados"
        />
        <FinanceMetricCard
          icon={WalletCards}
          label="Ingreso mensual"
          value="$24,800"
          detail="Sueldo y entradas adicionales de junio"
          tone="blue"
        />
        <FinanceMetricCard
          icon={CalendarClock}
          label="Última actualización"
          value="18 jun 2026"
          detail={`${rows.length} movimientos registrados.`}
          tone="amber"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Todos los ingresos</CardTitle>
            <CardDescription>
              Sueldo, trabajo independiente, rendimientos y ventas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="w-[90px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.label}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {INCOME_CHANNEL_LABELS[entry.channel]}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.date}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-primary">
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <CrudRowActions
                        itemLabel={entry.label}
                        onEdit={() => incomeCrud.onEdit(entry)}
                        onDelete={() => incomeCrud.onDelete(entry)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar ingreso</CardTitle>
            <CardDescription>
              Captura una nueva entrada de dinero.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={addIncome}>
              <div className="space-y-2">
                <Label htmlFor="income-label">Concepto</Label>
                <Input
                  id="income-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ej. Pago freelance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-category">Categoría</Label>
                <select
                  id="income-category"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  {channels.map((item) => (
                    <option key={item} value={item}>
                      {INCOME_CHANNEL_LABELS[item]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-amount">Monto (MXN)</Label>
                <Input
                  id="income-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-date">Fecha del ingreso</Label>
                <Input
                  id="income-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Guardar ingreso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {crud.dialogs}
    </div>
  );
}
