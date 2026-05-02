import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Features | Dreamfinery – Plan Savings and Achieve Goals Faster",
  "Discover features that help you organize your goals, plan your savings, and stay on track.",
  "/features"
)

export default function FeaturesPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Dreamfinery Features</h1>
        <p className="perex">A simple way to organize your goals and plan your savings.</p>
      </div>

      <div className="text-section">
        <p className="paragraph">
          Turn your goals into a clear plan and see when you may be able to reach them.
        </p>

        <h2 className="subheading">Goal Planning</h2>
        <p className="paragraph">
          With <strong className="strong-text">Dreamfinery</strong>, you can organize your saving
          goals in one place — whether you are planning something personal, preparing for a gift, or
          setting money aside for future expenses.
        </p>
        <p className="paragraph">
          Keep your plans structured and always know what you are working toward.
        </p>

        <h2 className="subheading">Smart Saving</h2>
        <p className="paragraph">
          Your monthly amount is virtually organized across your goals based on the priorities you
          set. You define your plan, and <strong className="strong-text">Dreamfinery</strong> helps
          keep everything structured.
        </p>
        <p className="paragraph">
          By adjusting priorities, you can instantly see how your monthly amount is distributed and
          stay within your planned budget while moving toward your goals.
        </p>
        <p className="paragraph">
          You also get a clear estimate of when each goal may be achieved, helping you stay focused
          and confident in your progress.
        </p>

        <h2 className="subheading">Plan Your Expenses With Confidence</h2>
        <p className="paragraph">
          Plan one-time, recurring, and future expenses in advance so you are better prepared for
          what is coming.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> helps you stay organized and avoid
          unexpected financial pressure.
        </p>

        <h2 className="subheading">Turn Intentions Into Real Progress</h2>
        <p className="paragraph">
          Turn your goals into a clear plan and take consistent steps forward instead of keeping
          everything in your head.
        </p>

        <h2 className="subheading">Progress Estimates</h2>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> adapts to the way you save. If you
          use the same monthly amount, your progress is calculated automatically.
        </p>
        <p className="paragraph">
          If your savings vary, you can choose how your progress is estimated. Use a simple average
          or a more realistic median based on your recent saving history.
        </p>
        <p className="paragraph">
          This gives you a clearer view of when your goals may be achieved.
        </p>

        <h2 className="subheading">Multiple Saving Plans</h2>
        <p className="paragraph">
          Create separate saving plans for different areas of your life and keep everything
          organized in one place.
        </p>
        <p className="paragraph">
          Manage personal goals, shared plans, or family finances with full flexibility.
        </p>

        <h2 className="subheading">Share and Collaborate</h2>
        <p className="paragraph">
          Add other users to your saving plans using their email address. You can choose whether
          they can view or edit your goals and priorities.
        </p>
        <p className="paragraph">
          Stay in control while allowing others to help manage your plans — such as adding items or
          adjusting priorities — when you give them permission.
        </p>

        <h2 className="subheading">Scheduled Updates & Notifications</h2>
        <p className="paragraph">
          Choose a specific day each month when your saving plan is updated across your goals. This
          keeps your planning consistent and predictable.
        </p>
        <p className="paragraph">
          You will receive a notification when this update happens, so you can stay informed by
          email or optional web alerts.
        </p>
      </div>
    </div>
  )
}