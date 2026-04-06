import BlogDetail from '@/_views/BlogDetail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BlogDetail id={id} />
}
