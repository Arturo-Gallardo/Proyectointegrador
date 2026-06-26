import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Car, Laptop, LineChart, WalletCards } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { useTheme } from "context/ThemeContext";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { expenses as expenseEntries } from "data/mockData";
import { formatCurrency } from "lib/format";
import { chart, chartAxisColor, chartContrastColor, chartGridColor } from "lib/theme";

const trend = [
  { month: "Ene", income: 22600, expenses: 15800 },
  { month: "Feb", income: 23800, expenses: 16400 },
  { month: "Mar", income: 23200, expenses: 15100 },
  { month: "Abr", income: 25100, expenses: 17200 },
  { month: "May", income: 24600, expenses: 15900 },
  { month: "Jun", income: 24800, expenses: 16320 },
];

const spending = [
  { name: "Vivienda", value: 6528, color: "#075c3b" },
  { name: "Alimentos", value: 4080, color: "#3f9567" },
  { name: "Transporte", value: 2448, color: "#78bd8e" },
  { name: "Ocio", value: 1632, color: "#b6d9bd" },
  { name: "Servicios", value: 1632, color: "#6b7378" },
];

const assets = [
  { name: "Automóvil", detail: "Toyota Corolla 2021", value: 198000, icon: Car },
  { name: "Laptop", detail: "MacBook Air M1", value: 18500, icon: Laptop },
  { name: "Fondo de inversión", detail: "Índice S&P 500", value: 125000, icon: LineChart },
];

const payments = expenseEntries
  .filter((item) => item.recurring)
  .map((item) => ({
    name: item.label,
    due: `${String(item.dueDay).padStart(2, "0")} Jul`,
    value: item.amount,
  }))
  .sort((a, b) => a.due.localeCompare(b.due));

function KpiCard({ title, value, hint }) {
  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl tabular-nums text-primary">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  useDocumentTitle("Resumen");
  const { isDark } = useTheme();
  const axisColor = chartAxisColor(isDark);
  const contrastColor = chartContrastColor(isDark);
  const gridColor = chartGridColor(isDark);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resumen financiero</h1>
        <p className="text-sm text-muted-foreground">Tu dinero, tus gastos y el valor de lo que tienes, en un solo lugar.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Saldo disponible" value={formatCurrency(32450)} hint="Dinero disponible en tus cuentas." />
        <KpiCard title="Ingresos del mes" value={formatCurrency(24800)} hint="Todo lo que recibiste este mes." />
        <KpiCard title="Gastos del mes" value={formatCurrency(16320)} hint="66% de tus ingresos mensuales." />
        <KpiCard title="Patrimonio neto" value={formatCurrency(184900)} hint="Lo que tienes menos lo que debes." />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Ingresos y gastos</CardTitle><CardDescription>Tu flujo de dinero durante los últimos seis meses.</CardDescription></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chart.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={chart.primary} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                <XAxis dataKey="month" stroke={axisColor} fontSize={12}/>
                <YAxis stroke={axisColor} fontSize={12} tickFormatter={(v) => `${v / 1000}k`}/>
                <Tooltip formatter={(value) => formatCurrency(value)}/><Legend/>
                <Area type="monotone" dataKey="income" name="Ingresos" stroke={chart.primary} fill="url(#incomeFill)"/>
                <Area type="monotone" dataKey="expenses" name="Gastos" stroke={contrastColor} fill="transparent"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>En qué gastas</CardTitle><CardDescription>Distribución de tus gastos de este mes.</CardDescription></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart><Pie data={spending} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>{spending.map((item) => <Cell key={item.name} fill={item.color}/>)}</Pie><Tooltip formatter={(value) => formatCurrency(value)}/><Legend/></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Activos</CardTitle><CardDescription>Bienes que conservan valor y podrías vender; no son solo un gasto.</CardDescription></CardHeader>
          <CardContent><Table><TableHeader><TableRow><TableHead>Activo</TableHead><TableHead className="text-right">Valor actual</TableHead></TableRow></TableHeader><TableBody>
            {assets.map(({ name, detail, value, icon: Icon }) => <TableRow key={name}><TableCell><div className="flex items-center gap-3"><span className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4"/></span><span><span className="block font-medium">{name}</span><span className="text-xs text-muted-foreground">{detail}</span></span></div></TableCell><TableCell className="text-right font-medium tabular-nums text-primary">{formatCurrency(value)}</TableCell></TableRow>)}
          </TableBody></Table></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pagos recurrentes</CardTitle><CardDescription>Gastos que se repiten cada mes y su siguiente vencimiento.</CardDescription></CardHeader>
          <CardContent><Table><TableHeader><TableRow><TableHead>Pago</TableHead><TableHead>Vence</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader><TableBody>
            {payments.map((item) => <TableRow key={item.name}><TableCell><div className="flex items-center gap-3 font-medium"><span className="rounded-md bg-primary/10 p-2 text-primary"><WalletCards className="h-4 w-4"/></span>{item.name}</div></TableCell><TableCell className="text-muted-foreground">{item.due}</TableCell><TableCell className="text-right font-medium tabular-nums">{formatCurrency(item.value)}</TableCell></TableRow>)}
          </TableBody></Table></CardContent>
        </Card>
      </div>
    </div>
  );
}
