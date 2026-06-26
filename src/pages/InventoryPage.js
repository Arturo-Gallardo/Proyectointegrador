import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  PackageCheck,
  Pencil,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { inventoryItems } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { usePrototypeCrudUi } from "hooks/usePrototypeCrudUi";
import { createCrudHandlers } from "lib/formSchemas";
import { useTheme } from "context/ThemeContext";
import { formatCurrency } from "lib/format";
import {
  chart,
  chartAxisColor,
  chartContrastColor,
  chartGridColor,
} from "lib/theme";
import { CrudAddButton } from "components/crud/CrudAddButton";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "low", label: "Stock bajo" },
  { value: "expiring", label: "Caducidad" },
  { value: "healthy", label: "Disponibles" },
];

function itemStatus(item) {
  const daysToExpiry = Math.ceil(
    (new Date(`${item.expiresOn}T00:00:00`) -
      new Date("2026-06-09T00:00:00")) /
      86_400_000
  );

  if (daysToExpiry <= 0) {
    return {
      key: "expired",
      label: "Caducado",
      variant: "destructive",
      low: item.quantity <= item.reorderAt,
      expiring: true,
    };
  }
  if (item.quantity <= item.reorderAt) {
    return {
      key: "low",
      label: "Stock bajo",
      variant: "warning",
      low: true,
      expiring: daysToExpiry <= 30,
    };
  }
  if (daysToExpiry <= 30) {
    return {
      key: "expiring",
      label: "Por caducar",
      variant: "destructive",
      low: false,
      expiring: true,
    };
  }
  return {
    key: "healthy",
    label: "Disponible",
    variant: "success",
    low: false,
    expiring: false,
  };
}

export default function InventoryPage() {
  useDocumentTitle("Inventario");
  const crud = usePrototypeCrudUi();
  const ingredientCrud = createCrudHandlers(crud, "inventoryIngredient");
  const { isDark } = useTheme();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const axisColor = chartAxisColor(isDark);
  const contrastColor = chartContrastColor(isDark);
  const gridColor = chartGridColor(isDark);
  const usage = inventoryItems.map((item) => ({
    name: item.name.split(" ")[0],
    onHand: item.quantity,
    par: item.reorderAt,
  }));
  const itemsWithStatus = inventoryItems.map((item) => ({
    ...item,
    status: itemStatus(item),
  }));
  const visibleItems = itemsWithStatus.filter((item) => {
    const matchesQuery = item.name
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesStatus =
      status === "all" ||
      (status === "low" && item.status.low) ||
      (status === "expiring" && item.status.expiring) ||
      (status === "healthy" && item.status.key === "healthy");
    return matchesQuery && matchesStatus;
  });
  const lowCount = itemsWithStatus.filter((item) => item.status.low).length;
  const expiringCount = itemsWithStatus.filter(
    (item) => item.status.expiring
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
        <p className="text-sm text-muted-foreground">
          Niveles mínimos, costos unitarios y riesgo de caducidad en una sola vista.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disponible vs. objetivos de reorden</CardTitle>
          <CardDescription>
            Compara existencias disponibles contra niveles de reorden.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usage}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Bar
                dataKey="onHand"
                name="Disponible"
                fill={chart.primary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="par"
                name="Reorden en"
                fill={contrastColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle>Registro de ingredientes</CardTitle>
              <CardDescription>
                Busca un ingrediente y actualiza stock, costo o caducidad desde una
                sola fila.
              </CardDescription>
            </div>
            <CrudAddButton onAdd={ingredientCrud.onAdd}>
              Agregar ingrediente
            </CrudAddButton>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <PackageCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ingredientes</p>
                <p className="font-semibold tabular-nums">{inventoryItems.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <TriangleAlert className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs text-muted-foreground">Stock bajo</p>
                <p className="font-semibold tabular-nums">{lowCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
              <CalendarClock className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Caducidad próxima</p>
                <p className="font-semibold tabular-nums">{expiringCount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar ingrediente..."
                className="pl-9"
                aria-label="Buscar ingrediente"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={status === option.value ? "default" : "outline"}
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 sm:px-6">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-2">Ingrediente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Existencia</TableHead>
                <TableHead>Costo unitario</TableHead>
                <TableHead>Caducidad</TableHead>
                <TableHead className="pr-4 text-right sm:pr-2">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4 sm:pl-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Reordenar al llegar a {item.reorderAt} {item.unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status.variant}>{item.status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium tabular-nums">{item.quantity}</span>{" "}
                    <span className="text-muted-foreground">{item.unit}</span>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(item.unitCost)}
                  </TableCell>
                  <TableCell className="font-medium">{item.expiresOn}</TableCell>
                  <TableCell className="pr-4 sm:pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => ingredientCrud.onEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label={`Eliminar ${item.name}`}
                        onClick={() => ingredientCrud.onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {visibleItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <p className="font-medium">No encontramos ingredientes</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Prueba otra búsqueda o cambia el filtro.
                    </p>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {crud.dialogs}
    </div>
  );
}
