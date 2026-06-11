import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Assets from './pages/assets/Assets'
import AssetForm from './pages/assets/AssetForm'
import Tickets from './pages/tickets/Tickets'
import TicketForm from './pages/tickets/TicketForm'
import AuditLogs from './pages/audit/AuditLogs'
import Users from './pages/users/Users'
import UserForm from './pages/users/UserForm'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
          <Route path="/assets/new" element={<ProtectedRoute roles={['admin','manager']}><AssetForm /></ProtectedRoute>} />
          <Route path="/assets/:id/edit" element={<ProtectedRoute roles={['admin','manager']}><AssetForm /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute roles={['admin','manager','technician']}><Tickets /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute roles={['admin','manager','technician']}><TicketForm /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute roles={['admin','manager','technician']}><TicketForm /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute roles={['admin','manager']}><AuditLogs /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['admin','manager']}><Users /></ProtectedRoute>} />
          <Route path="/users/new" element={<ProtectedRoute roles={['admin']}><UserForm /></ProtectedRoute>} />
          <Route path="/users/:id/edit" element={<ProtectedRoute roles={['admin']}><UserForm /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
