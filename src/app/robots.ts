import type { MetadataRoute } from 'next'

// Never crawlable, whatever the admin puts in the robots_txt setting.
const PROTECTED_PATHS = ['/admin', '/api']

// A robots.txt group only applies to the most specific matching user-agent, so
// a bot with its own group ignores the rules under '*'. The protected paths are
// therefore added to every group, and a '*' group is created if none exists.
function enforceProtectedPaths(rules: any[]): any[] {
  const guarded = rules.map(rule => ({
    ...rule,
    allow: (rule.allow ?? []).filter(Boolean),
    disallow: Array.from(
      new Set([...(rule.disallow ?? []).filter(Boolean), ...PROTECTED_PATHS])
    ),
  }))

  if (!guarded.some(rule => rule.userAgent === '*')) {
    guarded.unshift({ userAgent: '*', allow: ['/'], disallow: [...PROTECTED_PATHS] })
  }

  return guarded
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL
  const defaultRules: MetadataRoute.Robots = {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...PROTECTED_PATHS],
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
            rules: enforceProtectedPaths(rules),
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
