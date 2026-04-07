import { getSiteUrl } from "./site-url"

export const createMetadata = (title: string, description: string, path: string) => {
  const isProduction = process.env.VERCEL_ENV === "production"

  const siteUrl = getSiteUrl()

  // zabezpečí správne spojenie URL
  const canonicalUrl = `${siteUrl}${path}`

  return {
    metadataBase: new URL(siteUrl),

    title,
    description,

    robots: {
      index: isProduction,
      follow: isProduction,
      noarchive: !isProduction,
      nosnippet: !isProduction,
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Wishetto",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
    },
  }
}