import type { MetadataRoute } from 'next'

const BASE_URL = 'https://truscomp.com'
const API = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (err) {
    clearTimeout(id)
    console.error(`Fetch timeout/error for ${url}:`, err)
    throw err
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/services`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/services/gcc`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/calculator`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/testimonials`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/resources`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/updates`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/contact`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/terms-conditions`, priority: 0.3, changeFrequency: 'yearly' },
  ]

  if (!API) {
    console.warn('NEXT_PUBLIC_API_BASE_URL is not defined. Returning static routes only.')
    return staticRoutes
  }

  try {
    const [servicesRes, blogsRes, updatesRes] = await Promise.allSettled([
      fetchWithTimeout(`${API}/services?public_view=true`, { next: { revalidate: 3600 } }),
      fetchWithTimeout(`${API}/blogs?status=active&limit=100`, { next: { revalidate: 3600 } }),
      fetchWithTimeout(`${API}/labour-law-updates?status=active&limit=100`, { next: { revalidate: 3600 } }),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = []

    if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
      const json = await servicesRes.value.json()
      const list = json.data ?? json
      for (const s of Array.isArray(list) ? list : []) {
        dynamicRoutes.push({
          url: `${BASE_URL}/services/${s.slug ?? s.id}`,
          lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
          priority: 0.7,
          changeFrequency: 'monthly',
        })
      }
    }

    if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
      const json = await blogsRes.value.json()
      const list = json.data ?? json
      for (const b of Array.isArray(list) ? list : []) {
        dynamicRoutes.push({
          url: `${BASE_URL}/blog/${b.slug ?? b.id}`,
          lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
          priority: 0.6,
          changeFrequency: 'monthly',
        })
      }
    }

    if (updatesRes.status === 'fulfilled' && updatesRes.value.ok) {
      const json = await updatesRes.value.json()
      const list = json.data ?? json
      for (const u of Array.isArray(list) ? list : []) {
        dynamicRoutes.push({
          url: `${BASE_URL}/updates/${u.slug ?? u.id}`,
          lastModified: u.updated_at ? new Date(u.updated_at) : new Date(),
          priority: 0.6,
          changeFrequency: 'weekly',
        })
      }
    }

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error)
    return staticRoutes
  }
}
