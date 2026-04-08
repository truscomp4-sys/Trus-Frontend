import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import WageCalculator from '@/_views/WageCalculator'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('wage_calculator')
}

export default WageCalculator
