import Header from "@/components/Header"
import { getSiteUrl } from "@/lib/site-url"
import { createMetadata } from "@/lib/seo"

import "@/styles/theme.css"

// SEO metadata
export const metadata = createMetadata(
  "Terms of Use | Wishetto",
  "Terms and conditions for using Wishetto.",
  "/terms"
)


export default function TermsPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Terms of Use</h1>
        <p className="perex">Please read these terms carefully before using Wishetto.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">Acceptance of Terms</h2>
        <p className="paragraph">
          By accessing or using <strong className="strong-text">Wishetto</strong>, you agree to be
          bound by these Terms of Use. If you do not agree, you may not use the application.
        </p>

        <h2 className="subheading">Use of the Service</h2>
        <p className="paragraph">
          Wishetto is provided to help you plan your finances, organize your goals, and manage your
          savings.
        </p>
        <p className="paragraph">
          You agree to use the service only for lawful purposes and in a way that does not harm the
          service or other users.
        </p>

        <h2 className="subheading">User Responsibilities</h2>
        <p className="paragraph">
          You are responsible for the accuracy of the data you enter into Wishetto.
        </p>
        <p className="paragraph">
          You agree not to misuse, disrupt, or attempt to gain unauthorized access to the service.
        </p>

        <h2 className="subheading">Accounts</h2>
        <p className="paragraph">
          If you create an account, you are responsible for maintaining the confidentiality of your
          login information and for all activities under your account.
        </p>

        <h2 className="subheading">Service Availability</h2>
        <p className="paragraph">
          We strive to keep Wishetto available at all times, but we do not guarantee uninterrupted
          or error-free operation.
        </p>

        <h2 className="subheading">Limitation of Liability</h2>
        <p className="paragraph">
          <strong className="strong-text">Wishetto</strong> is provided "as is" without warranties
          of any kind. We are not responsible for any financial decisions or losses resulting from
          the use of the service.
        </p>

        <h2 className="subheading">Changes to the Terms</h2>
        <p className="paragraph">
          We may update these Terms of Use at any time. Continued use of the service means you
          accept the updated terms.
        </p>

        <h2 className="subheading">Contact</h2>
        <p className="paragraph">
          If you have any questions about these Terms, you can contact us at:
        </p>
        <p className="paragraph">
          <strong className="strong-text">support@wishetto.com</strong>
        </p>
      </div>
    </div>
  )
}
