/** Datos de ejemplo para gráficos y tablas cuando la API está fuera de línea. */

export const dashboardKpis = {
  grossIncome: 184_200,
  netIncome: 42_850,
  monthlyExpenses: 98_400,
  profitMarginPct: 23.3,
  dailyBreakEven: 3_300,
  monthlyRevenueTarget: 115_000,
};

export const revenueTrend = [
  { month: "Ene", revenue: 120000, expenses: 78000 },
  { month: "Feb", revenue: 132000, expenses: 81000 },
  { month: "Mar", revenue: 128000, expenses: 79500 },
  { month: "Abr", revenue: 145000, expenses: 83000 },
  { month: "May", revenue: 152000, expenses: 86000 },
  { month: "Jun", revenue: 168000, expenses: 88000 },
];

export const expenseBreakdown = [
  { name: "Alimentos", value: 4080 },
  { name: "Transporte", value: 2448 },
  { name: "Vivienda", value: 6528 },
  { name: "Servicios", value: 6500 },
  { name: "Ocio", value: 1632 },
  { name: "Suscripciones", value: 1032 },
];

export const inventoryAlerts = [
  { item: "Salmón del Atlántico", qty: 4, unit: "kg", threshold: 8 },
  { item: "Crema espesa", qty: 2, unit: "L", threshold: 6 },
  { item: "Tomates San Marzano", qty: 6, unit: "latas", threshold: 12 },
];

export const supplierReminders = [
  { supplier: "Mariscos Costa", due: "2026-05-18", amount: 4200 },
  { supplier: "Productos del Valle", due: "2026-05-22", amount: 1850 },
  {
    supplier: "Suministros Panadería Artesanal",
    due: "2026-05-28",
    amount: 960,
  },
];

export const expenseCategories = [
  "INGREDIENTS",
  "RENT",
  "UTILITIES",
  "SALARIES",
  "MAINTENANCE",
  "SUBSCRIPTIONS",
];

export const expenses = [
  {
    id: "1",
    label: "Supermercado",
    category: "INGREDIENTS",
    amount: 4080,
    date: "2026-05-08",
    recurring: false,
  },
  {
    id: "2",
    label: "Electricidad e internet",
    category: "UTILITIES",
    amount: 1632,
    date: "2026-05-06",
    recurring: true,
    dueDay: 7,
  },
  {
    id: "3",
    label: "Transporte y gasolina",
    category: "SALARIES",
    amount: 2448,
    date: "2026-05-01",
    recurring: false,
  },
  {
    id: "4",
    label: "Consulta médica",
    category: "MAINTENANCE",
    amount: 800,
    date: "2026-05-03",
    recurring: false,
  },
  {
    id: "5",
    label: "Streaming y música",
    category: "SUBSCRIPTIONS",
    amount: 832,
    date: "2026-05-01",
    recurring: true,
    dueDay: 12,
  },
  {
    id: "6",
    label: "Renta mensual",
    category: "RENT",
    amount: 6528,
    date: "2026-05-01",
    recurring: true,
    dueDay: 5,
  },
];

export const incomeEntries = [
  {
    id: "inc-1",
    label: "Sueldo mensual",
    channel: "DINE_IN",
    paymentMethod: "CARD",
    reference: "Nómina junio",
    amount: 18000,
    date: "2026-06-08",
    recurring: true,
  },
  {
    id: "inc-2",
    label: "Diseño freelance",
    channel: "TAKEOUT",
    paymentMethod: "MIXED",
    reference: "Proyecto web",
    amount: 3200,
    date: "2026-06-08",
    recurring: false,
  },
  {
    id: "inc-3",
    label: "Rendimiento de inversión",
    channel: "DELIVERY",
    paymentMethod: "TRANSFER",
    reference: "Fondo indexado",
    amount: 1100,
    date: "2026-06-07",
    recurring: true,
  },
  {
    id: "inc-4",
    label: "Venta de teléfono anterior",
    channel: "CATERING",
    paymentMethod: "TRANSFER",
    reference: "Venta particular",
    amount: 2500,
    date: "2026-06-06",
    recurring: false,
  },
];

export const inventoryItems = [
  {
    id: "1",
    name: "Aceite de oliva (extra virgen)",
    quantity: 18,
    unit: "L",
    unitCost: 14.2,
    expiresOn: "2026-11-01",
    reorderAt: 10,
  },
  {
    id: "2",
    name: "Arroz arborio",
    quantity: 22,
    unit: "kg",
    unitCost: 3.8,
    expiresOn: "2027-01-15",
    reorderAt: 15,
  },
  {
    id: "3",
    name: "Parmigiano Reggiano",
    quantity: 5,
    unit: "kg",
    unitCost: 38.5,
    expiresOn: "2026-06-20",
    reorderAt: 8,
  },
  {
    id: "4",
    name: "Crema espesa",
    quantity: 2,
    unit: "L",
    unitCost: 4.1,
    expiresOn: "2026-05-14",
    reorderAt: 6,
  },
];

export const suppliers = [
  {
    id: "1",
    name: "Mariscos Costa",
    email: "pedidos@mariscoscosta.example",
    phone: "+1 (555) 201-4490",
    products: "Pescado, mariscos",
    lastPurchase: "2026-05-02",
    lastTotal: 4200,
    paymentDue: "2026-05-18",
  },
  {
    id: "2",
    name: "Productos del Valle",
    email: "ventas@productosdelvalle.example",
    phone: "+1 (555) 330-8821",
    products: "Verduras, hierbas",
    lastPurchase: "2026-05-09",
    lastTotal: 1850,
    paymentDue: "2026-05-22",
  },
  {
    id: "3",
    name: "Suministros Panadería Artesanal",
    email: "hola@panaderiaartesanal.example",
    phone: "+1 (555) 771-0093",
    products: "Harina, levadura, mantequilla",
    lastPurchase: "2026-04-28",
    lastTotal: 960,
    paymentDue: "2026-05-28",
  },
];

export const menuItems = [
  {
    id: "1",
    name: "Risotto de hongos silvestres",
    price: 26,
    ingredientCost: 7.2,
    marginPct: 72,
    popularity: 88,
  },
  {
    id: "2",
    name: "Branzino a la parrilla",
    price: 34,
    ingredientCost: 12.4,
    marginPct: 64,
    popularity: 76,
  },
  {
    id: "3",
    name: "Burrata y tomate heirloom",
    price: 18,
    ingredientCost: 6.1,
    marginPct: 66,
    popularity: 92,
  },
  {
    id: "4",
    name: "Tarta de chocolate",
    price: 12,
    ingredientCost: 4.8,
    marginPct: 60,
    popularity: 54,
  },
];

export const breakEven = {
  fixedCostsMonthly: 62000,
  variableCostPct: 38,
  contributionMarginPct: 62,
  dailyRevenueNeeded: 3300,
  monthlyRevenueTarget: 115000,
  ordersPerDayAtAvgTicket: 61,
  avgTicket: 40,
};

export const alerts = [
  {
    id: "1",
    type: "INVENTORY",
    severity: "warning",
    message: "La crema espesa está por debajo del nivel mínimo.",
    createdAt: "2026-05-11T09:12:00Z",
  },
  {
    id: "2",
    type: "SUPPLIER",
    severity: "info",
    message: "Pago a Mariscos Costa vence en 6 días.",
    createdAt: "2026-05-11T08:40:00Z",
  },
  {
    id: "3",
    type: "EXPENSE",
    severity: "warning",
    message:
      "El gasto en servicios supera en 14% el promedio de los últimos 3 meses.",
    createdAt: "2026-05-10T16:05:00Z",
  },
  {
    id: "4",
    type: "PROFIT",
    severity: "critical",
    message: "Margen neto proyectado 3 pts por debajo del trimestre anterior.",
    createdAt: "2026-05-09T11:22:00Z",
  },
];

export const forecastRevenue = [
  { month: "Jul", actual: null, forecast: 172000 },
  { month: "Ago", actual: null, forecast: 178000 },
  { month: "Sep", actual: null, forecast: 181000 },
  { month: "Oct", actual: null, forecast: 186000 },
];

export const forecastExpenses = [
  { month: "Jul", forecast: 91000 },
  { month: "Ago", forecast: 92500 },
  { month: "Sep", forecast: 93800 },
  { month: "Oct", forecast: 95200 },
];
