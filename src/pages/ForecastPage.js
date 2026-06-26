import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { useTheme } from "context/ThemeContext";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { formatCurrency } from "lib/format";
import { chartAxisColor, chartGridColor } from "lib/theme";

const projection = [
  { month: "Mar", income: 23200, expenses: 15100 },
  { month: "Abr", income: 25100, expenses: 17200 },
  { month: "May", income: 24600, expenses: 15900 },
  { month: "Jun", income: 24800, expenses: 16320, incomeForecast: 24800, expenseForecast: 16320 },
  { month: "Jul", incomeForecast: 25500, expenseForecast: 16600 },
  { month: "Ago", incomeForecast: 26200, expenseForecast: 16900 },
  { month: "Sep", incomeForecast: 26400, expenseForecast: 17150 },
  { month: "Oct", incomeForecast: 27200, expenseForecast: 17400 },
];

const getChangePercent = (current, previous) => Math.round(((current - previous) / previous) * 100);

const forecastBase = projection.slice(3);

const months = forecastBase.slice(1).map((item, index) => {
  const previous = forecastBase[index];
  const income = item.incomeForecast;
  const expenses = item.expenseForecast;
  const savings = income - expenses;
  const previousIncome = previous.incomeForecast ?? previous.income;
  const previousExpenses = previous.expenseForecast ?? previous.expenses;
  const previousSavings = previousIncome - previousExpenses;

  return {
    month: item.month,
    income,
    expenses,
    savings,
    incomeChange: getChangePercent(income, previousIncome),
    expenseChange: getChangePercent(expenses, previousExpenses),
    savingsChange: getChangePercent(savings, previousSavings),
  };
});

const ChangeValue = ({ value, reverse = false }) => {
  const isGood = reverse ? value <= 0 : value >= 0;
  const color = isGood ? "text-emerald-600 dark:text-emerald-400" : "text-destructive";

  return <p className={`font-medium tabular-nums ${color}`}>{value > 0 ? "+" : ""}{value}%</p>;
};

export default function ForecastPage() {
  useDocumentTitle("Pronostico");
  const { isDark } = useTheme();
  const axisColor = chartAxisColor(isDark);
  const gridColor = chartGridColor(isDark);
  const last = months.at(-1);

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Pronostico personal</h1><p className="text-sm text-muted-foreground">Una estimacion de tus ingresos, gastos y ahorro para los proximos cuatro meses.</p></div>

      <div className="grid gap-4 md:grid-cols-3">
        <FinanceMetricCard icon={TrendingUp} label="Ingresos estimados en octubre" value={formatCurrency(last.income)} detail="Basado en sueldo y entradas recurrentes." />
        <FinanceMetricCard icon={TrendingDown} label="Gastos estimados en octubre" value={formatCurrency(last.expenses)} detail="Incluye pagos fijos y gasto variable." tone="amber" />
        <FinanceMetricCard icon={PiggyBank} label="Ahorro estimado en octubre" value={formatCurrency(last.savings)} detail="36% de tus ingresos proyectados." tone="blue" />
      </div>

      <Card><CardHeader><CardTitle>Perspectiva de tu dinero</CardTitle><CardDescription>Lineas solidas para meses registrados y punteadas para la proyeccion.</CardDescription></CardHeader><CardContent className="h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={projection}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="month" stroke={axisColor} fontSize={12} /><YAxis stroke={axisColor} fontSize={12} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => formatCurrency(value)} /><Legend />
            <Line type="monotone" dataKey="income" name="Ingresos registrados" stroke="#16855b" strokeWidth={3} dot={{ fill: "#16855b" }} connectNulls={false} />
            <Line type="monotone" dataKey="expenses" name="Gastos registrados" stroke="#d97706" strokeWidth={3} dot={{ fill: "#d97706" }} connectNulls={false} />
            <Line type="monotone" dataKey="incomeForecast" name="Ingresos proyectados" stroke="#16855b" strokeDasharray="6 5" strokeWidth={2} dot={{ fill: "#16855b" }} />
            <Line type="monotone" dataKey="expenseForecast" name="Gastos proyectados" stroke="#d97706" strokeDasharray="6 5" strokeWidth={2} dot={{ fill: "#d97706" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Proximos meses</CardTitle><CardDescription>Cuanto podrian cambiar tus ingresos, gastos y ahorro contra el mes anterior.</CardDescription></CardHeader><CardContent className="space-y-2">
        <div className="hidden grid-cols-7 gap-4 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid"><span>Mes</span><span>Ingresos</span><span>Cambio</span><span>Gastos</span><span>Cambio</span><span>Ahorro</span><span>Cambio</span></div>
        {months.map((row) => <div key={row.month} className="grid gap-3 rounded-lg border-l-4 border-l-primary bg-muted/20 p-4 lg:grid-cols-7 lg:items-center"><p className="font-semibold">{row.month}</p><div><span className="text-xs text-muted-foreground lg:hidden">Ingresos</span><p className="font-medium tabular-nums text-primary">{formatCurrency(row.income)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio ingresos</span><ChangeValue value={row.incomeChange} /></div><div><span className="text-xs text-muted-foreground lg:hidden">Gastos</span><p className="font-medium tabular-nums text-amber-600 dark:text-amber-400">{formatCurrency(row.expenses)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio gastos</span><ChangeValue value={row.expenseChange} reverse /></div><div><span className="text-xs text-muted-foreground lg:hidden">Ahorro</span><p className="font-semibold tabular-nums text-sky-600 dark:text-sky-400">{formatCurrency(row.savings)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio ahorro</span><ChangeValue value={row.savingsChange} /></div></div>)}
      </CardContent></Card>
    </div>
  );
}
