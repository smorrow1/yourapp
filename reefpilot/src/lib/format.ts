import { formatDistanceToNowStrict } from 'date-fns';

export function timeAgo(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function gallonsToLiters(gal: number): number {
  return gal * 3.78541;
}

export function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
