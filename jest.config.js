/* eslint-env node */
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // podľa tvojho tsconfig "paths"
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
}

module.exports = createJestConfig(customJestConfig)
