import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Import pages (these will need to be adapted from the Inertia.js versions)
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import GitHubLogin from './pages/auth/GitHubLogin';
import FormsIndex from './pages/forms/Index';
import FormsCreate from './pages/forms/Create';
import FormsSubmit from './pages/forms/Submit';
import FormsSuccess from './pages/forms/Success';
import FormsManage from './pages/forms/Manage';
import FormsPreview from './pages/forms/Preview';
import FormsSchema from './pages/forms/Schema';
import SettingsProfile from './pages/settings/Profile';
import SettingsAppearance from './pages/settings/Appearance';

// Layout components
import AppLayout from './layouts/app-layout';
import AuthLayout from './layouts/auth-layout';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/forms/:id/submit" element={<FormsSubmit />} />
      <Route path="/forms/:formId/submit/success/:submissionId" element={<FormsSuccess />} />
      
      {/* Auth routes */}
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : (
          <AuthLayout>
            <Login />
          </AuthLayout>
        )
      } />
      
      <Route path="/auth/github" element={
        user ? <Navigate to="/dashboard" replace /> : <GitHubLogin />
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        user ? (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms" element={
        user ? (
          <AppLayout>
            <FormsIndex />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms/create" element={
        user ? (
          <AppLayout>
            <FormsCreate />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms/:id/edit" element={
        user ? (
          <AppLayout>
            <div>Edit form - to be implemented</div>
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms/:id/manage" element={
        user ? (
          <AppLayout>
            <FormsManage />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms/:id/preview" element={
        user ? (
          <AppLayout>
            <FormsPreview />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/forms/:id/schema" element={
        user ? (
          <AppLayout>
            <FormsSchema />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/settings/profile" element={
        user ? (
          <AppLayout>
            <SettingsProfile />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/settings/appearance" element={
        user ? (
          <AppLayout>
            <SettingsAppearance />
          </AppLayout>
        ) : <Navigate to="/login" replace />
      } />
      
      {/* Redirects */}
      <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
      
      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;