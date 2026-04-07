import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Getting Started | Wishetto – Plan What You Want",
  "Learn how to plan your wishes and organize savings with Wishetto.",
  "/getting-started"
)

export default function GettingStartedPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Getting Started with Wishetto</h1>
        <p className="perex">Plan what you want. Start saving for it today.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">Turn Wishes Into Plans</h2>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> helps you turn your wishes into clear,
          structured plans.
        </p>
        <p className="paragraph">
          Start by adding what you want to achieve and keep everything organized in one place.
        </p>

        <h2 className="subheading">Save for What Matters</h2>
        <p className="paragraph">
          Add anything you want to afford a vacation, furniture, or something personal.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> helps you gradually set aside money so
          you can move closer to your goals step by step.
        </p>

        <h2 className="subheading">Balance Your Budget</h2>
        <p className="paragraph">
          Your regular expenses stay the same while your savings are distributed across your goals.
        </p>
        <p className="paragraph">You stay in control and always know where your money is going.</p>

        <h2 className="subheading">Take the First Step</h2>
        <p className="paragraph">Create your first wish and start building a plan today.</p>
        <p className="paragraph">
          The sooner you start, the sooner you’ll reach what matters to you.
        </p>

        <h2 className="subheading">Built Around Your Life</h2>
        <p className="paragraph">
          Organize multiple goals, adjust priorities anytime, and adapt your plan as your life
          changes.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> helps you move from intention to action.
        </p>
      </div>
    </div>
  )
}
