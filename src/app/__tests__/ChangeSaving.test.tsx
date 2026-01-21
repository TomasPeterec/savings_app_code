import { render, screen, fireEvent } from "@testing-library/react"
import ChangeSaving from "@/components/ChangeSaving"

it("toggles expand / collapse when chevron is clicked", () => {
  render(<ChangeSaving setToggleChangeSaving={() => {}} />)

  const collapsable = screen.getByTestId("saving-form-collapsable")
  const toggleBtn = screen.getByTestId("chevron-toggle")

  // default = open
  expect(collapsable).toHaveClass("colapsableCenterOpen")

  // collapse
  fireEvent.click(toggleBtn)
  expect(collapsable).toHaveClass("colapsableCenterClosed")

  // expand again
  fireEvent.click(toggleBtn)
  expect(collapsable).toHaveClass("colapsableCenterOpen")
})
