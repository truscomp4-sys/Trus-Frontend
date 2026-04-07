import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import About from '@/_views/About'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('about')
}

export default About
