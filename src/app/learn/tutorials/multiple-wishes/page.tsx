import Header from "@/components/Header"
import Link from "next/link"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Multiple Dreams Tutorial | Dreamfinery",
  "Learn how to manage and prioritize multiple dreams in Dreamfinery.",
  "/learn/tutorials/multiple-dreams"
)

export default function MultipleDreamsTutorialPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Managing Multiple dreams</h1>
        <p className="perex">Learn how to organize and prioritize multiple goals.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">1. Add More dreams</h2>
        <p className="paragraph">
          You can create multiple dreams at any time — each representing a goal you want to achieve.
        </p>

        <h2 className="subheading">2. Set Priorities</h2>
        <p className="paragraph">
          Decide which dreams matter most and organize them based on importance.
        </p>

        <h2 className="subheading">3. Balance Your Plan</h2>
        <p className="paragraph">
          Dreamfinery distributes your savings across your dreams in a structured way.
        </p>

        <h2 className="subheading">4. Adjust Anytime</h2>
        <p className="paragraph">
          You can change priorities or amounts whenever your situation changes.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/learn/tutorials">← All tutorials</Link>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/learn/tutorials/saving">← Previous</Link>
          <span style={{ margin: "0 1rem" }}>|</span>
          <Link href="/learn/tutorials/getting-started">Next →</Link>
        </div>
      </div>
    </div>
  )
}
