// app/learn/faq/page.tsx
import Header from "@/components/Header"
import "@/styles/theme.css"

type FAQItem = {
  question: string
  answer: string
}

// simulate fetching data from database
const fetchFAQ = async (): Promise<FAQItem[]> => {
  return [
    {
      question: "How do I create an account?",
      answer: "Click on the Sign Up button and fill out the registration form.",
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes, our mobile app is available for both iOS and Android.",
    },
    {
      question: "How can I contact support?",
      answer: "You can reach us at support@dreamsave.com.",
    },
  ]
}

export default async function FAQPage() {
  // fetch FAQ data from server or database
  const faqItems = await fetchFAQ()

  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">FAQ Page</h1>
      </div>

      <div className="actions-section">
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{item.question}</h3>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ISR: page is cached for 86400 seconds (24 hours)
// After 24h, first request triggers regeneration
export const revalidate = 86400
