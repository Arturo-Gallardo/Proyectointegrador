import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { breakEven } from "data/mockData";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useTheme } from "context/ThemeContext";
import { formatCurrency, formatPercent } from "lib/format";
import { chart, chartAxisColor, chartGridColor } from "lib/theme";

const curve = [
  { day: "Lun", revenue: 2100, target: breakEven.dailyRevenueNeeded },
  { day: "Mar", revenue: 1980, target: breakEven.dailyRevenueNeeded },
  { day: "Mié", revenue: 2350, target: breakEven.dailyRevenueNeeded },
  { day: "Jue", revenue: 2600, target: breakEven.dailyRevenueNeeded },
  { day: "Vie", revenue: 3200, target: breakEven.dailyRevenueNeeded },
  { day: "Sáb", revenue: 3600, target: breakEven.dailyRevenueNeeded },
  { day: "Dom", revenue: 2800, target: breakEven.dailyRevenueNeeded },
];

export default function BreakEvenPage() {
  useDocumentTitle("Punto de equilibrio");
  const { isDark } = useTheme();
  const axisColor = chartAxisColor(isDark);
  const gridColor = chartGridColor(isDark);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Análisis de punto de equilibrio</h1>
        <p className="text-sm text-muted-foreground">
          Mezcla de costos fijos vs. variables, cobertura diaria de ingresos y
          pedidos necesarios con tu ticket promedio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Costos fijos</CardTitle>
            <CardDescription>Carga mensual.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {formatCurrency(breakEven.fixedCostsMonthly)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ratio de costo variable</CardTitle>
            <CardDescription>Como % de ventas netas.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {formatPercent(breakEven.variableCostPct)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ingresos diarios necesarios</CardTitle>
            <CardDescription>Para alcanzar el punto de equilibrio.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {formatCurrency(breakEven.dailyRevenueNeeded)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por día</CardTitle>
            <CardDescription>Con ticket promedio de {formatCurrency(breakEven.avgTicket)}.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {breakEven.ordersPerDayAtAvgTicket}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Rendimiento semanal vs. línea de equilibrio</CardTitle>
            <CardDescription>
              Margen de contribución {formatPercent(breakEven.contributionMarginPct)} después de costos variables.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curve}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" stroke={axisColor} />
              <YAxis stroke={axisColor} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Ingresos reales"
                stroke={chart.primary}
                fill={chart.primary}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Necesidad de equilibrio"
                stroke={chart.error}
                fill={chart.error}
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
