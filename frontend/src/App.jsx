import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminUsers from './pages/admin/Users';
import UserDashboard from './pages/user/Dashboard';
import UserProjects from './pages/user/Projects';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Admin routes */}
            <Route path="/admin" element={
              <PrivateRoute role="admin">
                <AppLayout><AdminDashboard /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/projects" element={
              <PrivateRoute role="admin">
                <AppLayout><AdminProjects /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute role="admin">
                <AppLayout><AdminUsers /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/admin/profile" element={
              <PrivateRoute role="admin">
                <AppLayout><Profile /></AppLayout>
              </PrivateRoute>
            } />

            {/* User routes */}
            <Route path="/dashboard" element={
              <PrivateRoute role="user">
                <AppLayout><UserDashboard /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/projects" element={
              <PrivateRoute role="user">
                <AppLayout><UserProjects /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute role="user">
                <AppLayout><Profile /></AppLayout>
              </PrivateRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
