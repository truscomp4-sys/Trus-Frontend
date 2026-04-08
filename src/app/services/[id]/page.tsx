import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import ServiceDetail from '@/_views/ServiceDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return fetchSEOMeta('service', id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ServiceDetail id={id} />
}
