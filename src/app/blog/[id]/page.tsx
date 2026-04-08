import type { Metadata } from 'next'
import { fetchSEOMeta } from '@/lib/seo'
import BlogDetail from '@/_views/BlogDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return fetchSEOMeta('blog', id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BlogDetail id={id} />
}
