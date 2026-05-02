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
  "FAQ | Dreamfinery – Plan Savings and Achieve Goals Faster",
  "Find answers to frequently asked questions about Dreamfinery and learn how to plan your goals and savings effectively.",
  "/learn/faq"
)

const siteUrl = getSiteUrl()

const fetchFAQ = async (): Promise<FAQItem[]> => {
  try {
    const response = await fetch(`${siteUrl}/api/faq`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // ISR: revalidate every hour
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
          <p>No FAQ items are available at the moment.</p>
        )}
      </div>
    </div>
  )
}

// Revalidate page every hour
export const revalidate = 3600