import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000000 ? 2 : value >= 1 ? 2 : 6,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number): string {
  const formattedValue = value.toFixed(2)
  const sign = value >= 0 ? "▲" : "▼"
  return `${sign} ${Math.abs(value).toFixed(2)}%`
}
