import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar       from './components/Navbar'
import Home         from './pages/Home'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Admin        from './pages/Admin'
import AdminConfig  from './pages/AdminConfig'
import ResetPassword from './pages/ResetPassword'
import { useNeonCycle } from './hooks/useNeonCycle'

function AppRoutes() {
  useNeonCycle(9000)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        } />

        <Route path="/adminconfig" element={
          <ProtectedRoute adminOnly>
            <AdminConfig />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SiteConfigProvider>
    </AuthProvider>
  )
}
