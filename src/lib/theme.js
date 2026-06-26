// Brand palette — keep in sync with CSS variables in index.css
export const brand = {
  green: "#73CB52",
  header: "#CFE6C7",
  dark: "#425F57",
  white: "#FFFFFF",
  black: "#000000",
  error: "#E53F41",
};

export const chart = {
  primary: "hsl(104, 54%, 56%)",
  contrast: "hsl(163, 18%, 32%)",
  tertiary: "hsl(104, 40%, 70%)",
  error: "hsl(359, 76%, 57%)",
  muted: "hsl(163, 15%, 35%)",
  neutral: "hsl(163, 10%, 55%)",
};

export const CHART_COLORS = [
  chart.primary,
  chart.contrast,
  chart.tertiary,
  chart.error,
  chart.muted,
  chart.neutral,
];

/** Colores por categoría en el gráfico de desglose de gastos del panel. */
export const EXPENSE_BREAKDOWN_COLORS = {
  Ingredientes: chart.primary,
  Salarios: chart.contrast,
  Alquiler: chart.tertiary,
  Servicios: chart.error,
  Mantenimiento: "hsl(76, 55%, 44%)",
  Suscripciones: chart.neutral,
};

export function expenseBreakdownColor(name, index) {
  return EXPENSE_BREAKDOWN_COLORS[name] ?? CHART_COLORS[index % CHART_COLORS.length];
}

export function chartAxisColor(isDark) {
  return isDark ? chart.neutral : chart.muted;
}

export function chartContrastColor(isDark) {
  return isDark ? brand.white : brand.dark;
}

export function chartGridColor(isDark) {
  return isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(66, 95, 87, 0.1)";
}
