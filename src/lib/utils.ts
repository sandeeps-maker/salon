import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTime(timeStr: string): string {
  return timeStr;
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'ARRIVED':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'SERVICE_STARTED':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse';
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'NO_SHOW':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
