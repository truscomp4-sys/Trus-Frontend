import AdminLayout from '@/components/admin/AdminLayout'

// Admin pages use localStorage/window — opt out of static generation
export const dynamic = 'force-dynamic'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
