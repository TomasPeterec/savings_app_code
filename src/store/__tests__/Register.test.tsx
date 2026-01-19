jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

import { render, screen, fireEvent } from "@testing-library/react"
import RegistrationPage from "@/app/register/page"

describe("RegistrationPage handleRegister", () => {
  it("calls handleRegister correctly when inputs are valid", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})

    render(<RegistrationPage />)

    const emailInput = screen.getByPlaceholderText("Email")
    const passwordInput = screen.getByPlaceholderText("Password")
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password")
    const displaynameInput = screen.getByPlaceholderText("Displayname")
    const registerButton = screen.getByRole("button", { name: /Register/i })

    // Fill all fields with valid data
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "123456" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "123456" } })
    fireEvent.change(displaynameInput, { target: { value: "Tester" } })

    // Click register
    fireEvent.click(registerButton)

    // Check console output
    expect(consoleSpy).toHaveBeenCalledWith("Can be registered:", true)

    consoleSpy.mockRestore()
  })

  it("does not call handleRegister if passwords do not match", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})

    render(<RegistrationPage />)

    const emailInput = screen.getByPlaceholderText("Email")
    const passwordInput = screen.getByPlaceholderText("Password")
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password")
    const displaynameInput = screen.getByPlaceholderText("Displayname")
    const registerButton = screen.getByRole("button", { name: /Register/i })

    // Fill all fields but mismatched passwords
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "123456" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "654321" } })
    fireEvent.change(displaynameInput, { target: { value: "Tester" } })

    // Click register
    fireEvent.click(registerButton)

    // Should not call console log
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
