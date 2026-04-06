import UpdateDetail from '@/_views/UpdateDetail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UpdateDetail id={id} />
}
