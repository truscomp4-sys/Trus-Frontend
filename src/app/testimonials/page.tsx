import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import Testimonials from '@/_views/Testimonials'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('testimonials')
}

export default Testimonials
