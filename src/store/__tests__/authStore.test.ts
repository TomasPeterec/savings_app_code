import { useAuthStore } from "../authStore"
import { User } from "firebase/auth"

describe("authStore", () => {
  it("sets user correctly", () => {
    // Get initial state
    const { setUser, user } = useAuthStore.getState()
    expect(user).toBeNull()

    // Create a fake user (cast as Firebase User)
    const fakeUser = { uid: "123", email: "test@example.com" } as User;

    // Update the store
    setUser(fakeUser)

    // Check if store updated correctly
    expect(useAuthStore.getState().user).toEqual(fakeUser)
  })
})
