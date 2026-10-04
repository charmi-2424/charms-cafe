/** Format a number as Indian Rupees */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Generate a unique order ID */
export function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CH-${num}`;
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Get estimated ready time (minutes from now) */
export function getEstimatedReadyAt(minutes: number): string {
  const d = new Date(Date.now() + minutes * 60 * 1000);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
