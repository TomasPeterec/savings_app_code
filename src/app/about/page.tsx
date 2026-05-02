import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

import "@/styles/theme.css"

// SEO metadata
export const metadata = createMetadata(
  "About | Dreamfinery – Plan Savings and Achieve Goals Faster",
  "Learn more about Dreamfinery and how it can help you plan your goals and savings effectively.",
  "/about"
)

export default function AboutPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">About Dreamfinery</h1>
        <p className="perex">Smart Saving & Goal Planning Made Simple</p>
      </div>

      <div className="text-section">
        <p className="paragraph">
          Have you ever wanted something for a long time, like a place to visit, an instrument to
          play, or something you’ve always dreamed of owning, but never managed to save for it
          because other expenses always felt more important?
        </p>

        <h2 className="subheading">Turn Your Intentions Into Real Progress</h2>
        <p className="paragraph">
          At <strong className="strong-text">Dreamfinery</strong>, your goals become clear and
          structured. Instead of keeping your plans in your head, you organize them in one place and
          assign each goal a defined priority. This makes it easier to focus on what truly matters
          and move forward with purpose.
        </p>

        <h2 className="subheading">Saving That Follows Your Priorities</h2>
        <p className="paragraph">
          Each goal can be assigned a percentage of your monthly amount using simple sliders. Your
          monthly amount is automatically virtually divided across all goals according to these
          priorities. You set the rules once, and the system takes care of the rest. You can also
          choose the day of the month when your amount is applied, keeping your savings process
          consistent and predictable.
        </p>

        <h2 className="subheading">Plan Your Expenses With Confidence</h2>
        <p className="paragraph">
          <strong className="strong-text">Dreamfinery</strong> is not only for saving toward goals.
          It also helps you organize your household or family budget. You can plan long-term
          recurring or one-time expenses in advance. For example, if you know that certain payments
          like property tax are due in a specific month, you can prepare for them ahead of time. The
          same applies to special occasions such as birthdays, holidays, or the start of the school
          year. Instead of being surprised by seasonal costs, you can plan for them and stay in
          control of your finances.
        </p>

        <h2 className="subheading">Clear and Realistic Projections</h2>
        <p className="paragraph">
          As you adjust the priority of a goal, the system immediately updates the estimated time
          needed to reach it. If your monthly savings vary or are irregular, you can choose how
          projections are calculated. You can use either an average or a median to better reflect
          your real saving habits. This gives you a realistic view of when your goals can be
          achieved.
        </p>

        <h2 className="subheading">Focus on What Truly Matters</h2>
        <p className="paragraph">
          Many goals feel out of reach not because they are impossible, but because they lack
          structure. With a clear system and defined priorities, saving becomes intentional. Instead
          of postponing your goals, you steadily work toward them every month. Whether it is a
          musical instrument, a motorcycle, or a long-awaited trip, you decide what matters most,
          and the system helps you stay on track.
        </p>

        <p className="paragraph">
          Start today. Give your goals structure and move one step closer to the things you have
          always wanted.
        </p>
      </div>
    </div>
  )
}