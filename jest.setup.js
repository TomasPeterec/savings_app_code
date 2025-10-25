// jest.setup.js

// Polyfills and testing utilities
require('@testing-library/jest-dom');
require('whatwg-fetch'); // Polyfill fetch for Jest

// -------------------------
// Mock localStorage for zustand persist middleware
// -------------------------
beforeAll(() => {
  let store = {};

  const localStorageMock = {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

// -------------------------
// Mock Next.js router globally
// -------------------------
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    pathname: '/',
    query: {},
  }),
}));

// -------------------------
// Mock Firebase globally
// -------------------------
jest.mock('firebase/app');
jest.mock('firebase/auth');
