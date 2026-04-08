import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Services from '@/_views/Services'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('services_main')
}

export default Services
