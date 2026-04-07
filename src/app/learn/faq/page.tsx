import Header from "@/components/Header"
import "@/styles/theme.css"
import { createMetadata } from "@/lib/seo"
import { getSiteUrl } from "@/lib/site-url"

type FAQItem = {
  id: number
  question: string
  answer: string
}

// SEO metadata for the FAQ page
export const metadata = createMetadata(
  "FAQ | Wishetto – Plan Savings, Achieve Goals Faster",
  "Find answers to the most frequently asked questions about Wishetto.",
  "/learn/faq"
)

const siteUrl = getSiteUrl()

const fetchFAQ = async (): Promise<FAQItem[]> => {
  try {
    const response = await fetch(`${siteUrl}/api/faq`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch FAQ:", response.statusText)
      return []
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return []
  }
}

export default async function FAQPage() {
  const faqItems = await fetchFAQ()

  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Frequently Asked Questions</h1>
      </div>

      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map(item => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      )}

      <div className="actions-section">
        {faqItems.length > 0 ? (
          faqItems.map(item => (
            <div key={item.id} className="faq-item">
              <h2 className="faq-question">{item.question}</h2>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))
        ) : (
          <p>No FAQ items available at the moment.</p>
        )}
      </div>
    </div>
  )
}

export const revalidate = 86400
