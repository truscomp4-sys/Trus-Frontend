import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import PrivacyPolicy from '@/_views/PrivacyPolicy'

export async function generateMetadata(): Promise<Metadata> {
  return fetchSEOMeta('privacy_policy')
}

export default PrivacyPolicy
