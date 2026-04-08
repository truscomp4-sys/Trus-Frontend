import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import TermsConditions from '@/_views/TermsConditions'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('terms_of_service')
}

export default TermsConditions
