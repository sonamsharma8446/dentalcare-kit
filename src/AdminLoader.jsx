import { Suspense, lazy } from 'react'

// The admin dashboard is a separate download, fetched only when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

export default function AdminLoader() {
  return (
    <Suspense fallback={<p style={{ padding: '2rem' }}>Loading admin dashboard...</p>}>
      <AdminApp />
    </Suspense>
  )
}
