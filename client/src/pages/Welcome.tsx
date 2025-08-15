import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Welcome() {
  const { user, login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-2"></div>
            <span className="text-xl font-bold text-gray-900">DevelForm</span>
          </div>
          <div>
            {user ? (
              <Link 
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => login()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Forms Like You Build Code
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and deploy forms with the same version control workflow you know and love from software development.
          </p>
          
          {user ? (
            <div className="space-x-4">
              <Link 
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Dashboard
              </Link>
              <Link 
                to="/forms/create"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors inline-block"
              >
                Create Form
              </Link>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started with GitHub
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Intuitive Form Builder',
              description: 'Drag-and-drop interface with real-time preview and validation.',
              icon: '📝',
            },
            {
              title: 'Version Control',
              description: 'Track changes, create branches, and merge with confidence.',
              icon: '🔄',
            },
            {
              title: 'Secure Submissions',
              description: 'Handle anonymous and authenticated submissions with tokens.',
              icon: '🔒',
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} DevelForm. Built with Hono and React.
          </p>
        </div>
      </footer>
    </div>
  );
}