import Header from "@/components/Header"

import "@/styles/theme.css" // import new CSS

// SEO metadata
export const metadata = {
  title: "About | Wishetto – Plan Savings, Achieve Goals Faster",
  description:
    "Turn your financial goals into a clear plan. Wishetto helps you prioritize savings, track progress, and plan future expenses like holidays, bills, and personal goals with confidence.",
}

export default function AboutPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">About</h1>
      </div>

      <div className="text-section">
        <p className="paragraph">
          Have you ever wanted something for a long time, like a place to visit, an instrument to
          play, or something you’ve always dreamed of owning, but never managed to save for it
          because other expenses always felt more important?{" "}
        </p>

        <h3 className="subheading">Turn Your Intentions Into Real Progress</h3>
        <p className="paragraph">
          At <strong className="strong-text">Wishetto</strong>, your goals become clear and
          structured. Instead of keeping your plans in your head, you organize them in one place and
          give each goal a defined priority. This makes it easier to focus on what truly matters and
          move forward with purpose.{" "}
        </p>

        <h3 className="subheading">Saving That Follows Your Priorities</h3>
        <p className="paragraph">
          Each goal can be assigned a percentage based on your monthly contribution using simple
          sliders. Your monthly deposit is automatically divided across all goals according to these
          priorities. You set the rules once, and the system takes care of the rest. You can also
          choose the day of the month when your contribution is applied, keeping your saving process
          consistent and predictable.
        </p>

        <h3 className="subheading">Plan Your Expenses With Confidence</h3>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> is not only for saving toward goals. It
          also helps you organize your household or family budget. You can plan longer time
          recurring or one-time expenses in advance. For example, if you know that certain payments
          like property tax are due in a specific month, you can assign and prepare for them ahead
          of time. The same applies to special occasions such as birthdays, holidays, or the start
          of the school year. Instead of being surprised by seasonal costs, you can plan for them
          and stay in control of your finances.
        </p>

        <h3 className="subheading">Clear and Realistic Projections</h3>
        <p className="paragraph">
          As you adjust the priority of an item, the system immediately updates the estimated time
          needed to reach each goal. If your monthly savings vary or are irregular, you can choose
          how projections are calculated. You can use either an average or a median to better
          reflect your real saving habits. This gives you a realistic view of when your goals can be
          achieved.
        </p>

        <h3 className="subheading">Focus on What Truly Matters</h3>
        <p className="paragraph">
          Many goals feel out of reach not because they are impossible, but because they lack
          structure. With a clear system and defined priorities, saving becomes intentional. Instead
          of postponing your goals, you steadily work toward them every month. Whether it is a
          musical instrument, a motorcycle, or a long-awaited trip, you decide what matters most,
          and the system helps you stay on track.
        </p>

        <p className="paragraph">
          Start today. Give your goals structure, and move one step closer to the things you have
          always wanted.
        </p>
      </div>
    </div>
  )
}
