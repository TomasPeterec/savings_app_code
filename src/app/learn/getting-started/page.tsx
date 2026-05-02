import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Getting Started with Dreamfinery – Plan Your Goals and Savings",
  "Learn how to organize your goals, set priorities, and build a clear saving plan with Dreamfinery.",
  "/getting-started"
)

export default function GettingStartedPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Getting Started with Dreamfinery</h1>
        <p className="perex">Turn your goals into a clear saving plan.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">Turn Goals Into Plans</h2>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> helps you organize what you want to
          achieve into clear, structured goals.
        </p>
        <p className="paragraph">
          Add your goals, keep them in one place, and start building a plan that is easy to follow.
        </p>

        <h2 className="subheading">Save for What Matters</h2>
        <p className="paragraph">
          Add anything you want to save for, such as a vacation, furniture, or something personal.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> helps you set money aside gradually
          so you can move closer to your goals step by step.
        </p>

        <h2 className="subheading">Balance Your Budget</h2>
        <p className="paragraph">
          Your regular expenses stay unchanged while your savings are distributed across your goals.
        </p>
        <p className="paragraph">You stay in control and always know where your money is going.</p>

        <h2 className="subheading">Take the First Step</h2>
        <p className="paragraph">Create your first goal and start building your plan today.</p>
        <p className="paragraph">
          The sooner you start, the sooner you can move closer to what matters to you.
        </p>

        <h2 className="subheading">Built Around Your Life</h2>
        <p className="paragraph">
          Organize multiple goals, adjust priorities anytime, and adapt your plan as your life
          changes.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> helps you move from intention to
          action with a system that fits your everyday life.
        </p>
      </div>
    </div>
  )
}