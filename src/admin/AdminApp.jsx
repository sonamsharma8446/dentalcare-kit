import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './admin.css';
import { AuthProvider, useAuth } from './auth.jsx';
import { ToastProvider } from './components/Toast.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Vendors from './pages/Vendors.jsx';
import Partners from './pages/Partners.jsx';
import Orders from './pages/Orders.jsx';
import Enquiries from './pages/Enquiries.jsx';
import Support from './pages/Support.jsx';
import Reports from './pages/Reports.jsx';
import Activity from './pages/Activity.jsx';
import Team from './pages/Team.jsx';
import Placeholder from './pages/Placeholder.jsx';

// Sends visitors who are not logged in to the login page.
function RequireAuth({ children }) {
  const { admin, checking } = useAuth();
  const location = useLocation();
  if (checking) return <div className="adm-fullpage" role="status">Checking your login...</div>;
  if (!admin) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// Pages only for the "admin" role (staff are sent back to the dashboard).
export function AdminOnly({ children }) {
  const { admin } = useAuth();
  return admin.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default function AdminApp() {
  useEffect(() => {
    document.title = 'DentalCare Admin';
    // Keep the admin area out of search engines
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="adm">
      <BrowserRouter basename="/admin">
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth><Layout /></RequireAuth>}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="partners" element={<Partners />} />
                <Route path="orders" element={<Orders />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="support" element={<Support />} />
                <Route path="reports" element={<Reports />} />
                <Route path="team" element={<AdminOnly><Team /></AdminOnly>} />
                <Route path="activity" element={<AdminOnly><Activity /></AdminOnly>} />
                <Route path="*" element={<Placeholder title="Page not found" />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
