import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminLoader from './AdminLoader.jsx'

// /admin shows the admin dashboard (loaded on demand). Every other address shows
// the public website, exactly as before.
const path = window.location.pathname
const isAdminPage = path === '/admin' || path.startsWith('/admin/')

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAdminPage ? <AdminLoader /> : <App />}</StrictMode>,
)

