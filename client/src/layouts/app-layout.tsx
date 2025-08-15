import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  breadcrumbs?: { name: string; href?: string }[];
}

export default function AppLayout({ children, hideHeader, breadcrumbs }: AppLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && (
        <header className="bg-white shadow">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-2"></div>
                <span className="text-xl font-bold text-gray-900">DevelForm</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/forms" className="text-gray-600 hover:text-gray-900">
                  Forms
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <div className="flex items-center space-x-2">
                      {user.avatarUrl && (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                    <Link 
                      to="/settings/profile"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="pb-4">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    {breadcrumbs.map((breadcrumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <span className="text-gray-400 mx-2">/</span>
                        )}
                        {breadcrumb.href ? (
                          <Link
                            to={breadcrumb.href}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {breadcrumb.name}
                          </Link>
                        ) : (
                          <span className="text-gray-600">{breadcrumb.name}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}