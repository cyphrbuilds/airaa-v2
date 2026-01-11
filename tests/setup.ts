/**
 * Vitest global setup
 * Provides localStorage mock and other test utilities
 */

import { beforeEach, afterEach, vi } from 'vitest'

// Create a fresh localStorage mock
function createLocalStorageMock() {
  let store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    // Helper to get raw store for debugging
    _getStore: () => store,
  }
}

// The mock instance - will be recreated for each test
let localStorageMock = createLocalStorageMock()

// Assign to global initially
Object.defineProperty(globalThis, 'localStorage', {
  get: () => localStorageMock,
  configurable: true,
})

// Reset everything before each test
beforeEach(() => {
  // Create fresh localStorage
  localStorageMock = createLocalStorageMock()
  
  // Reset all module state by resetting modules
  vi.resetModules()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.clearAllMocks()
})

// Export for direct access in tests if needed
export { localStorageMock }
