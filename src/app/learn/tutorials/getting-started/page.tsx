import Header from "@/components/Header"
import Link from "next/link"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Getting Started Tutorial | Wishetto",
  "Learn step by step how to create your first wish and start saving with Wishetto.",
  "/learn/tutorials/getting-started"
)

export default function GettingStartedTutorialPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Getting Started Tutorial</h1>
        <p className="perex">Create your first wish and start saving step by step.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">1. Create Your First Wish</h2>
        <p className="paragraph">
          Start by adding something you want to achieve — for example a vacation or new furniture.
        </p>

        <h2 className="subheading">2. Set a Target Amount</h2>
        <p className="paragraph">Define how much you need to save to reach your goal.</p>

        <h2 className="subheading">3. Add to Your Plan</h2>
        <p className="paragraph">
          Wishetto will help you distribute your savings across your wishes.
        </p>

        <h2 className="subheading">4. Stay Consistent</h2>
        <p className="paragraph">
          Your savings grow over time without affecting your daily expenses.
        </p>

        <h2 className="subheading">5. Track Your Progress</h2>
        <p className="paragraph">See how close you are to achieving each of your goals.</p>

        {/* NAVIGÁCIA */}
        <div style={{ marginTop: "2rem" }}>
          <Link href="/learn/tutorials">← All tutorials</Link>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {/* Previous – na list (alebo môžeš dať iný tutorial) */}
          <Link href="/learn/tutorials">← Previous</Link>

          <span style={{ margin: "0 1rem" }}>|</span>

          {/* Next tutorial */}
          <Link href="/learn/tutorials/saving">Next →</Link>
        </div>
      </div>
    </div>
  )
}
