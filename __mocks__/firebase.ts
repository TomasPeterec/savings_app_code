// src/__mocks__/firebase.ts

export const initializeApp = jest.fn(() => ({}))

export const getAuth = jest.fn(() => ({
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}))

export const GoogleAuthProvider = jest.fn(() => ({}))
