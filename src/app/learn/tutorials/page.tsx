import Header from "@/components/Header"
import Link from "next/link"
import { createMetadata } from "@/lib/seo"

export const metadata = createMetadata(
  "Tutorials | Dreamfinery – Learn How It Works",
  "Step-by-step guides to help you get the most out of Dreamfinery.",
  "/learn/tutorials"
)

const tutorials = [
  {
    title: "Getting Started",
    description: "Learn how to create your first dreams and start planning.",
    slug: "getting-started",
  },
  {
    title: "How Saving Works",
    description: "Understand how Dreamfinery distributes your savings.",
    slug: "saving",
  },
  {
    title: "Managing Multiple Dreams",
    description: "Organize and prioritize your financial goals.",
    slug: "multiple-dreams",
  },
]

export default function TutorialsPage() {
  return (
    <div className="base-container">
      <Header />

      <div className="hero-section">
        <h1 className="heading">Tutorials</h1>
        <p className="perex">Learn how to use Dreamfinery step by step.</p>
      </div>

      <div className="actions-section">
        {tutorials.map(t => (
          <Link key={t.slug} href={`/learn/tutorials/${t.slug}`}>
            <div className="faq-item" style={{ cursor: "pointer" }}>
              <h2 className="faq-question">{t.title}</h2>
              <p className="faq-answer">{t.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
