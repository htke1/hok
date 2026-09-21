// Simple cn utility without external dependencies
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate tax amount (GST 12% for rooms under 7500, 18% for above)
 */
export function calculateTax(baseAmount: number): number {
  const rate = baseAmount >= 7500 ? 0.18 : 0.12;
  return Math.round(baseAmount * rate);
}

/**
 * Generate a booking reference number
 */
export function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'HOK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

