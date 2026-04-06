import ServiceDetail from '@/_views/ServiceDetail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ServiceDetail id={id} />
}
