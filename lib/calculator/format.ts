const eurFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const eurFormatterWithCents = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatEur(value: number): string {
  return eurFormatter.format(value);
}

export function formatEurWithCents(value: number): string {
  return eurFormatterWithCents.format(value);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE').format(Math.round(value));
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  }
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000)}k €`;
  }
  return formatEur(value);
}
