import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Contact from '@/_views/Contact'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('contact')
}

export default Contact
