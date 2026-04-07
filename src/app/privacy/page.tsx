import Header from "@/components/Header"
import { getSiteUrl } from "@/lib/site-url"
import { createMetadata } from "@/lib/seo"

import "@/styles/theme.css"

// SEO metadata
export const metadata = createMetadata(
  "Privacy Policy | Wishetto",
  "How Wishetto collects, uses, and protects your data.",
  "/privacy"
)

const siteUrl = getSiteUrl()

export default function PrivacyPage() {
  return (
    <div className="text-page-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Privacy Policy</h1>
        <p className="perex">Your privacy is important to us.</p>
      </div>

      <div className="text-section">
        <h2 className="subheading">Introduction</h2>
        <p className="paragraph">
          This Privacy Policy explains how <strong className="strong-text">Wishetto</strong>{" "}
          collects, uses, and protects your personal data in accordance with applicable data
          protection laws, including the GDPR.
        </p>

        <h2 className="subheading">Data We Collect</h2>
        <p className="paragraph">We may collect the following types of information:</p>
        <ul>
          <li className="paragraph">Email address (if you create an account)</li>
          <li className="paragraph">Usage data (how you interact with the application)</li>
          <li className="paragraph">Basic account information</li>
        </ul>

        <h2 className="subheading">How We Use Your Data</h2>
        <p className="paragraph">We use your data to:</p>
        <ul>
          <li className="paragraph">Provide and maintain the service</li>
          <li className="paragraph">Improve the user experience</li>
          <li className="paragraph">Respond to your requests or support inquiries</li>
        </ul>

        <h2 className="subheading">Legal Basis (GDPR)</h2>
        <p className="paragraph">Under GDPR, we process your data based on:</p>
        <ul>
          <li className="paragraph">Your consent</li>
          <li className="paragraph">Performance of a contract</li>
          <li className="paragraph">Our legitimate interest in improving the service</li>
        </ul>

        <h2 className="subheading">Data Storage</h2>
        <p className="paragraph">
          Your data is stored securely and is only accessible to authorized systems and personnel.
        </p>

        <h2 className="subheading">Data Sharing</h2>
        <p className="paragraph">
          We do not sell your personal data. We may share data only with trusted service providers
          necessary to operate the application.
        </p>

        <h2 className="subheading">Your Rights (GDPR)</h2>
        <p className="paragraph">
          If you are located in the European Union, you have the right to:
        </p>
        <ul>
          <li className="paragraph">Access your personal data</li>
          <li className="paragraph">Request correction of your data</li>
          <li className="paragraph">Request deletion of your data</li>
          <li className="paragraph">Object to processing of your data</li>
          <li className="paragraph">Request data portability</li>
        </ul>

        <h2 className="subheading">Data Retention</h2>
        <p className="paragraph">
          We retain your data only for as long as necessary to provide the service or comply with
          legal obligations.
        </p>

        <h2 className="subheading">Security</h2>
        <p className="paragraph">
          We take reasonable measures to protect your data, but no system can be 100% secure.
        </p>

        <h2 className="subheading">Changes to This Policy</h2>
        <p className="paragraph">
          We may update this Privacy Policy from time to time. Changes will be reflected on this
          page.
        </p>

        <h2 className="subheading">Contact</h2>
        <p className="paragraph">
          If you have any questions about this Privacy Policy or your data, contact us at:
        </p>
        <p className="paragraph">
          <strong className="strong-text">support@wishetto.com</strong>
        </p>
      </div>
    </div>
  )
}
