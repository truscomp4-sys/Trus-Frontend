import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import UpdateDetail from '@/_views/UpdateDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return fetchSEOMeta('labour_law_update', id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UpdateDetail id={id} />
}
