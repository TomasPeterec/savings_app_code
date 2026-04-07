import Header from "@/components/Header"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Contact | Wishetto",
  "Get in touch with the Wishetto team. We are happy to help with any questions or feedback.",
  "/contact"
)

export default function ContactPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section" style={{ marginBottom: "2rem" }}>
        <h1 className="heading">Contact</h1>
        <p className="perex">Have a question or feedback? We’d love to hear from you.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">Get in Touch</h2>
        <p className="paragraph">
          If you have any questions, ideas, or feedback about Wishetto, feel free to reach out.
        </p>

        <h2 className="subheading">Email</h2>
        <p className="paragraph">You can contact us directly at:</p>
        <p className="paragraph">
          <strong className="strong-text">support@wishetto.com</strong>
        </p>

        <h2 className="subheading">Feedback</h2>
        <p className="paragraph">
          We are constantly improving Wishetto and your feedback is very valuable.
        </p>

        <h2 className="subheading">Bug Reports</h2>
        <p className="paragraph">
          If you encounter any issues, please let us know so we can fix them as soon as possible.
        </p>

        <h2 className="subheading">What to Include</h2>
        <p className="paragraph">When contacting us, please include as much detail as possible:</p>
        <ul>
          <li className="paragraph">What you were trying to do</li>
          <li className="paragraph">What happened</li>
          <li className="paragraph">Any error messages</li>
        </ul>

        <h2 className="subheading">Response Time</h2>
        <p className="paragraph">We usually respond within 1–2 business days.</p>
      </div>
    </div>
  )
}
