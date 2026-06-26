import * as React from "react";
import { CalendarClock, CreditCard, Plus, ReceiptText } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Badge } from "components/ui/badge";
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
import { Switch } from "components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { expenseCategories, expenses as seedExpenses } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { usePrototypeCrudUi } from "hooks/usePrototypeCrudUi";
import { EXPENSE_CATEGORY_LABELS } from "lib/app";
import { createCrudHandlers } from "lib/formSchemas";
import { formatCurrency } from "lib/format";

export default function ExpensesPage() {
  useDocumentTitle("Gastos");
  const crud = usePrototypeCrudUi();
  const expenseCrud = createCrudHandlers(crud, "expense");
  const [rows, setRows] = React.useState(seedExpenses);
  const [label, setLabel] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState(expenseCategories[0]);
  const [date, setDate] = React.useState("2026-06-18");
  const [recurring, setRecurring] = React.useState(false);
  const recurringRows = rows.filter((row) => row.recurring);
  const recurringExpenses = recurringRows.reduce(
    (sum, row) => sum + row.amount,
    0
  );

  function addExpense(event) {
    event.preventDefault();
    if (!label.trim() || !amount || !date) return;
    setRows((items) => [
      {
        id: `local-${Date.now()}`,
        label: label.trim(),
        category,
        amount: Number(amount),
        date,
        recurring,
      },
      ...items,
    ]);
    setLabel("");
    setAmount("");
    setRecurring(false);
    crud.showSuccess({
      title: "Gasto registrado",
      description:
        "El gasto se ha registrado y ya forma parte de los cálculos financieros.",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de gastos
        </h1>
        <p className="text-sm text-muted-foreground">
          Clasifica tus gastos y mantén claro cuánto dinero sale cada mes.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FinanceMetricCard
          icon={ReceiptText}
          label="Gastos recurrentes"
          value={formatCurrency(recurringExpenses)}
          detail="Compromisos que se repiten cada mes."
          tone="amber"
        />
        <FinanceMetricCard
          icon={CreditCard}
          label="Gasto mensual"
          value={formatCurrency(16320)}
          detail="Todos los gastos realizados en junio."
        />
        <FinanceMetricCard
          icon={CalendarClock}
          label="Última actualización"
          value="18 jun 2026"
          detail={`${rows.length} movimientos registrados.`}
          tone="blue"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Todos los gastos</CardTitle>
            <CardDescription>
              Los recurrentes están señalados claramente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="w-[90px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {EXPENSE_CATEGORY_LABELS[row.category]}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.recurring ? "warning" : "outline"}>
                        {row.recurring ? "Recurrente" : "Único"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.date}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                      {formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <CrudRowActions
                        itemLabel={row.label}
                        onEdit={() => expenseCrud.onEdit(row)}
                        onDelete={() => expenseCrud.onDelete(row)}
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
            <CardTitle>Agregar gasto</CardTitle>
            <CardDescription>
              Captura una salida nueva y marca si se repite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={addExpense}>
              <div className="space-y-2">
                <Label htmlFor="expense-label">Concepto</Label>
                <Input
                  id="expense-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ej. Supermercado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-category">Categoría</Label>
                <select
                  id="expense-category"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {expenseCategories.map((item) => (
                    <option key={item} value={item}>
                      {EXPENSE_CATEGORY_LABELS[item]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Monto (MXN)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-date">Fecha del gasto</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="expense-recurring">Gasto recurrente</Label>
                  <p className="text-xs text-muted-foreground">
                    Se repite cada mes.
                  </p>
                </div>
                <Switch
                  id="expense-recurring"
                  checked={recurring}
                  onCheckedChange={setRecurring}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Guardar gasto
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {crud.dialogs}
    </div>
  );
}
