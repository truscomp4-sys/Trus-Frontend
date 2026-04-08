import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Index from '@/_views/Index'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('home')
}

export default Index
