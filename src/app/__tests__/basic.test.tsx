import { render, screen } from "@testing-library/react"

function TestComponent() {
  return <h1>Hello</h1>
}

test("renders hello", () => {
  render(<TestComponent />)
  expect(screen.getByText("Hello")).toBeInTheDocument()
})
