import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Resources from '@/_views/Resources'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('resources_main')
}

export default Resources
