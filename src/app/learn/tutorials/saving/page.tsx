import Header from "@/components/Header"
import Link from "next/link"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "How Saving Works | Wishetto",
  "Understand how Wishetto helps you save toward your goals over time.",
  "/learn/tutorials/saving"
)

export default function SavingTutorialPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">How Saving Works</h1>
        <p className="perex">See how your savings are planned and distributed.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">1. Set Your Goals</h2>
        <p className="paragraph">Each wish has a target amount you want to save.</p>

        <h2 className="subheading">2. Save Gradually</h2>
        <p className="paragraph">
          Instead of saving everything at once, Wishetto helps you build up your savings over time.
        </p>

        <h2 className="subheading">3. Distribute Savings</h2>
        <p className="paragraph">Your available budget is split across your active wishes.</p>

        <h2 className="subheading">4. Stay in Control</h2>
        <p className="paragraph">
          You can adjust how much you save or pause specific wishes anytime.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/learn/tutorials">← All tutorials</Link>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/learn/tutorials/getting-started">← Previous</Link>
          <span style={{ margin: "0 1rem" }}>|</span>
          <Link href="/learn/tutorials/multiple-wishes">Next →</Link>
        </div>
      </div>
    </div>
  )
}
