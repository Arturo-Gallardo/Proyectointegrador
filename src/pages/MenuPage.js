import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Badge } from "components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { menuItems } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { usePrototypeCrudUi } from "hooks/usePrototypeCrudUi";
import { useTheme } from "context/ThemeContext";
import { createCrudHandlers } from "lib/formSchemas";
import { formatCurrency, formatPercent } from "lib/format";
import { chart, chartAxisColor, chartContrastColor, chartGridColor } from "lib/theme";
import { CrudAddButton } from "components/crud/CrudAddButton";
import { CrudRowActions } from "components/crud/CrudRowActions";

export default function MenuPage() {
  useDocumentTitle("Menu profitability");
  const crud = usePrototypeCrudUi();
  const itemCrud = createCrudHandlers(crud, "menuItem");
  const { isDark } = useTheme();
  const axisColor = chartAxisColor(isDark);
  const contrastColor = chartContrastColor(isDark);
  const gridColor = chartGridColor(isDark);

  const sortedByPopularity = [...menuItems].sort((a, b) => b.popularity - a.popularity);
  const sortedByMargin = [...menuItems].sort((a, b) => a.marginPct - b.marginPct);

  const scatter = menuItems.map((m) => ({
    name: m.name,
    margin: m.marginPct,
    popularity: m.popularity,
    price: m.price,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Menu profitability</h1>
        <p className="text-sm text-muted-foreground">
          Ingredient loads, price realization, and popularity — find stars and
          margin leaks.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Best sellers</CardTitle>
              <CardDescription>Popularity index vs. plate contribution.</CardDescription>
            </div>
            <CrudAddButton variant="outline" onAdd={itemCrud.onAdd}>Add menu item</CrudAddButton>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Food cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Popularity</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedByPopularity.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(m.price)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(m.ingredientCost)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPercent(m.marginPct)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success">{m.popularity}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <CrudRowActions
                        itemLabel={m.name}
                        onEdit={() => itemCrud.onEdit(m)}
                        onDelete={() => itemCrud.onDelete(m)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Lowest margin plates</CardTitle>
              <CardDescription>Candidates for repricing or re-engineering.</CardDescription>
            </div>
            <CrudAddButton variant="outline" onAdd={itemCrud.onAdd}>Add plate</CrudAddButton>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Popularity</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedByMargin.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPercent(m.marginPct)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {m.popularity}
                    </TableCell>
                    <TableCell className="text-right">
                      <CrudRowActions
                        itemLabel={m.name}
                        onEdit={() => itemCrud.onEdit(m)}
                        onDelete={() => itemCrud.onDelete(m)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Margin vs. popularity</CardTitle>
            <CardDescription>
              Bubble size encodes menu price — spot high-labor plates with soft demand.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="popularity"
                name="Popularity"
                stroke={axisColor}
                domain={[40, 100]}
              />
              <YAxis
                type="number"
                dataKey="margin"
                name="Margin %"
                stroke={axisColor}
                domain={[50, 80]}
              />
              <ZAxis type="number" dataKey="price" range={[60, 400]} name="Price" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) =>
                  name === "Price" ? formatCurrency(value) : value
                }
              />
              <Legend />
              <Scatter name="Menu items" data={scatter} fill={chart.primary} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Ingredient load by plate</CardTitle>
            <CardDescription>Compare ingredient cost against current menu price.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={menuItems}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" hide />
              <YAxis stroke={axisColor} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="ingredientCost" name="Ingredient cost" fill={chart.error} />
              <Bar dataKey="price" name="Menu price" fill={contrastColor} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {crud.dialogs}
    </div>
  );
}
