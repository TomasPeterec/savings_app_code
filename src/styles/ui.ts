// src/styles/ui.ts

// Base containers
export const baseContainer = "min-h-screen bg-gray-100 flex flex-col"
export const centeredColumn = "flex flex-col items-center justify-center"
export const startColumn = "flex flex-col items-center justify-start"

// Layout-specific constants
export const body = `${baseContainer} font-sans`
export const main = "flex-grow p-4"
export const footer = "text-center text-gray-500 text-sm p-4 mt-auto"

// Page / UI constants
export const container = `${baseContainer} ${startColumn} p-4`
export const mainContent = `${baseContainer} ${centeredColumn} py-20 px-4 space-y-4`
export const heading = "text-3xl font-bold text-blue-600 mb-4"
export const paragraph = "text-gray-700 text-center max-w-md"
export const highlight = "font-semibold"

// Home page specific
export const heroSection = "text-center mt-8 space-y-2 max-w-md"
export const link = "text-blue-500 underline hover:text-blue-700"
export const buttonPrimary = "w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
export const buttonGoogle = "w-full px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
export const buttonRegister = "w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600"
export const inputField = "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
export const formCard = "bg-white p-4 rounded shadow space-y-3"
export const loginSection = "mt-8 w-full max-w-md flex flex-col space-y-4"

// Header-specific constants
export const header = "w-full bg-white shadow py-4 px-6 flex items-center justify-center"
export const headerTitle = "text-2xl font-bold text-blue-600"
