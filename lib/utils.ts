import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`
  }
  return value.toLocaleString()
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Truncate a URL for display, especially useful for Twitter/X URLs
 * Examples:
 *   https://x.com/Uniswap/status/123456789 -> @Uniswap/...6789
 *   https://x.com/Uniswap -> @Uniswap
 *   https://example.com/very/long/path -> example.com/very/lo...
 */
export function truncateUrl(url: string, maxLength = 25): string {
  // Handle Twitter/X URLs specially
  const twitterMatch = url.match(/(?:x\.com|twitter\.com)\/([^\/]+)(?:\/status\/(\d+))?/)
  if (twitterMatch) {
    const [, username, statusId] = twitterMatch
    if (statusId) {
      return `@${username}/...${statusId.slice(-4)}`
    }
    return `@${username}`
  }
  
  // Generic URL truncation
  try {
    const urlObj = new URL(url)
    const display = urlObj.hostname + urlObj.pathname
    if (display.length <= maxLength) return display
    return display.slice(0, maxLength - 3) + '...'
  } catch {
    // Not a valid URL, just truncate
    if (url.length <= maxLength) return url
    return url.slice(0, maxLength - 3) + '...'
  }
}
