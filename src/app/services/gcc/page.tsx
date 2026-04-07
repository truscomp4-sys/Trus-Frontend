import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import GCC from '@/_views/GCC'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('service', 'gcc')
}

export default GCC
