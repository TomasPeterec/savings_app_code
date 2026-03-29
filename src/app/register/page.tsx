// app/learn/faq/page.tsx
import Header from "@/components/Header"
import "@/styles/theme.css"

type FAQItem = {
  id: number
  question: string
  answer: string
}

// Server-side fetch for SEO-friendly FAQ
const fetchFAQ = async (): Promise<FAQItem[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not set")

    const response = await fetch(`${baseUrl}/api/faq`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // always fresh for SSR
    })

    if (!response.ok) {
      console.error("Failed to fetch FAQ:", response.statusText)
      return []
    }

    const data: FAQItem[] = await response.json()
    return data
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

// ISR: cache page for 24h, regenerates on first request after expiry
export const revalidate = 86400
