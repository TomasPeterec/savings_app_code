// app/learn/faq/page.tsx
import Header from "@/components/Header"
import "@/styles/theme.css"

type FAQItem = {
  id: number
  question: string
  answer: string
}

// SEO metadata
const isProduction = process.env.VERCEL_ENV === "production"

export const metadata = {
  title: "FAQ | Wishetto – Plan Savings, Achieve Goals Faster",
  description: "Find answers to the most frequently asked questions about Wishetto.",
  robots: {
    index: isProduction,
    follow: isProduction,
  },
}

const getBaseUrl = (): string => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

const fetchFAQ = async (): Promise<FAQItem[]> => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/faq`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch FAQ from backend:", response.statusText)
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
              <h3 className="faq-question">{item.question}</h3>
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
