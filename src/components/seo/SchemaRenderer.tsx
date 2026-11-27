'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type SchemaState = {
  pathname: string
  data: unknown
}

export default function SchemaRenderer() {
  const pathname = usePathname()
  const [schemaState, setSchemaState] = useState<SchemaState | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    // Clear the previous route's schema immediately and keep homepage schema server-rendered.
    setSchemaState(null)
    if (pathname === '/') {
      return () => controller.abort()
    }

    const fetchSchema = async () => {
      try {
        let pageType = ''
        let referenceId: string | null = null

        // Map pathname to matching pageType and referenceId in line with fetchSEOMeta calls
        if (pathname === '/about') {
          pageType = 'about'
        } else if (pathname === '/services') {
          pageType = 'services_main'
        } else if (pathname === '/calculator') {
          pageType = 'wage_calculator'
        } else if (pathname === '/testimonials') {
          pageType = 'testimonials'
        } else if (pathname === '/resources') {
          pageType = 'resources_main'
        } else if (pathname === '/updates') {
          pageType = 'resources_main'
        } else if (pathname === '/contact') {
          pageType = 'contact'
        } else if (pathname === '/privacy-policy') {
          pageType = 'privacy_policy'
        } else if (pathname === '/terms-conditions') {
          pageType = 'terms_of_service'
        } else if (pathname.startsWith('/services/')) {
          pageType = 'service'
          referenceId = pathname.replace('/services/', '')
        } else if (pathname.startsWith('/blog/')) {
          pageType = 'blog'
          referenceId = pathname.replace('/blog/', '')
        } else if (pathname.startsWith('/updates/')) {
          pageType = 'labour_law_update'
          referenceId = pathname.replace('/updates/', '')
        } else {
          // Avoid making API calls for routes that are not tracked (e.g. admin routes)
          return
        }

        const API = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!API) return

        const url = new URL(`${API}/seo/public`)
        url.searchParams.set('page_type', pageType)
        if (referenceId) url.searchParams.set('page_reference_id', referenceId)

        const res = await fetch(url.toString(), { signal: controller.signal })
        if (cancelled) return

        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data && data.schema_json) {
            setSchemaState({ pathname, data: data.schema_json })
          }
        }
      } catch (err) {
        if (!cancelled && !(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Error fetching dynamic schema JSON-LD:', err)
        }
      }
    }

    fetchSchema()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [pathname])

  if (!schemaState || schemaState.pathname !== pathname) return null

  const schemaJson = schemaState.data

  // Ensure that no malicious nested closing script tag breaks the DOM injection
  const safeSchemaString = typeof schemaJson === 'object'
    ? JSON.stringify(schemaJson).replace(/</g, '\\u003c')
    : String(schemaJson).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeSchemaString }}
    />
  )
}
