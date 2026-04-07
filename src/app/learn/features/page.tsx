import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Features | Wishetto – Plan Savings, Achieve Goals Faster",
  "Discover all features that help you plan, save, and achieve your financial goals.",
  "/features"
)

export default function FeaturesPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Features of Wishetto</h1>
        <p className="perex">The simple tool you need to plan and save.</p>
      </div>

      <div className="text-section">
        <p className="paragraph">
          Turn your financial goals into a clear plan. Know exactly when you’ll reach them.
        </p>

        <h2 className="subheading">Goal Planning</h2>
        <p className="paragraph">
          At <strong className="strong-text">Wishetto</strong>, you can organize your financial
          goals in one place — whether you are saving for something personal, planning a gift, or
          preparing for future expenses.
        </p>
        <p className="paragraph">
          Keep your plans structured and always know what you are working toward.
        </p>

        <h2 className="subheading">Smart Saving</h2>
        <p className="paragraph">
          Your savings are virtually organized across your goals based on the priorities you set.
          You define your monthly plan, and <strong className="strong-text">Wishetto</strong> takes
          care of the rest.
        </p>
        <p className="paragraph">
          By adjusting priorities, you can instantly see how your savings are organized and stay
          within your budget while progressing toward your goals.
        </p>
        <p className="paragraph">
          You also get a clear estimate of when each goal can be achieved, helping you stay focused
          and confident in your progress.
        </p>

        <h2 className="subheading">Plan Your Expenses With Confidence</h2>
        <p className="paragraph">
          Plan both one-time and future expenses in advance so you are always prepared for what’s
          coming.
        </p>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> helps you stay organized and avoid
          unexpected financial pressure.
        </p>

        <h2 className="subheading">Turn Intentions Into Real Progress</h2>
        <p className="paragraph">
          Turn your goals into a clear plan and take consistent steps forward instead of keeping
          everything in your head.
        </p>

        <h2 className="subheading">Progress Estimates</h2>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> adapts to how you save. If you
          contribute a fixed amount each month, your progress is calculated automatically.
        </p>
        <p className="paragraph">
          If your savings vary, you can choose how your progress is estimated. Use a simple average
          or a more realistic median based on your last 12 months of saving.
        </p>
        <p className="paragraph">
          This gives you a clear and reliable view of when your goals can be achieved.
        </p>

        <h2 className="subheading">Multiple Virtual Savings</h2>
        <p className="paragraph">
          Create separate savings for different areas of your life and keep everything organized in
          one place.
        </p>
        <p className="paragraph">
          Manage personal goals, shared plans, or family finances with full flexibility.
        </p>

        <h2 className="subheading">Share and Collaborate</h2>
        <p className="paragraph">
          Add other users to your virtual savings using their email address. You can choose whether
          they can view or edit your goals and priorities.
        </p>
        <p className="paragraph">
          Stay in control while allowing others to help manage your goals — such as adding items or
          adjusting priorities — when you give them permission.
        </p>

        <h2 className="subheading">Scheduled Updates & Notifications</h2>
        <p className="paragraph">
          Choose a specific day each month when your virtual savings are updated across your goals.
          This keeps your planning consistent and predictable.
        </p>
        <p className="paragraph">
          You will receive a notification when this update happens, so you always stay informed via
          email or optional web alerts.
        </p>
      </div>
    </div>
  )
}
