import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL
  const defaultRules: MetadataRoute.Robots = {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: 'https://www.truscomp.com/sitemap.xml',
  }

  if (!API) return defaultRules

  try {
    const res = await fetch(`${API}/settings/robots_txt`, { next: { revalidate: 60 } })
    if (res.ok) {
      const data = await res.json()
      if (data && data.value) {
        const text = String(data.value)
        const lines = text.split('\n')
        const rules: any[] = []
        let currentRule: any = null
        let sitemapUrl = 'https://www.truscomp.com/sitemap.xml'

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue

          const [key, ...valueParts] = trimmed.split(':')
          const value = valueParts.join(':').trim()
          const cleanKey = key.toLowerCase().trim()

          if (cleanKey === 'user-agent') {
            if (currentRule) {
              rules.push(currentRule)
            }
            currentRule = { userAgent: value, allow: [], disallow: [] }
          } else if (cleanKey === 'allow' && currentRule) {
            currentRule.allow.push(value)
          } else if (cleanKey === 'disallow' && currentRule) {
            currentRule.disallow.push(value)
          } else if (cleanKey === 'sitemap') {
            sitemapUrl = value
          }
        }

        if (currentRule) {
          rules.push(currentRule)
        }

        if (rules.length > 0) {
          return {
            rules,
            sitemap: sitemapUrl,
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating robots.txt metadata dynamically:', err)
  }

  return defaultRules
}
