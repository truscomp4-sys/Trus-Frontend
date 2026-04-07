import type { Metadata } from 'next'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface SEOMeta {
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  robots?: string
}

export async function fetchSEOMeta(pageType: string, referenceId?: string): Promise<Metadata> {
  try {
    const url = new URL(`${API}/seo/public`)
    url.searchParams.set('page_type', pageType)
    if (referenceId) url.searchParams.set('page_reference_id', referenceId)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return {}

    const data: SEOMeta = await res.json()
    if (!data?.meta_title) return {}

    return {
      title: data.meta_title,
      description: data.meta_description,
      ...(data.meta_keywords && { keywords: data.meta_keywords }),
      ...(data.robots && { robots: data.robots }),
      ...(data.canonical_url && { alternates: { canonical: data.canonical_url } }),
      openGraph: {
        title: data.og_title || data.meta_title,
        description: data.og_description || data.meta_description,
        ...(data.og_image && { images: [{ url: data.og_image }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: data.twitter_title || data.og_title || data.meta_title,
        description: data.twitter_description || data.og_description || data.meta_description,
        ...(data.og_image && { images: [data.og_image] }),
      },
    }
  } catch {
    return {}
  }
}
