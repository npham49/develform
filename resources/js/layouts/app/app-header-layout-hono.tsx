import { type BreadcrumbItem } from '@/types'
import { Link, useRouter } from '@tanstack/react-router'
import { FileText, Home, Layers, LogOut, Settings as SettingsIcon, User } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Breadcrumb, Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { useAuth } from '@/hooks/use-auth'

export default function AppHeaderLayout({
  children,
  breadcrumbs,
  hideHeader,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; hideHeader?: boolean }>) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.navigate({ to: '/auth/login' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideHeader && (
        <Navbar expand="lg" className="shadow-sm border-bottom" style={{ backgroundColor: '#ffffff' }}>
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-decoration-none">
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                }}
              >
                <Layers size={20} color="#fff" />
              </div>
              <strong className="text-dark">DevelForm</strong>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                {isAuthenticated && (
                  <>
                    <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center">
                      <Home size={16} className="me-2" />
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/forms" className="d-flex align-items-center">
                      <FileText size={16} className="me-2" />
                      Forms
                    </Nav.Link>
                  </>
                )}
              </Nav>

              <Nav>
                {isAuthenticated && user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="outline-light"
                      id="user-dropdown"
                      className="d-flex align-items-center border-0 text-dark"
                    >
                      <div
                        className="me-2 d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: '2rem',
                          height: '2rem',
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                        }}
                      >
                        <User size={16} />
                      </div>
                      {user.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Header>{user.email}</Dropdown.Header>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/settings/profile">
                        <SettingsIcon size={16} className="me-2" />
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <LogOut size={16} className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <div className="d-flex gap-2">
                    <Link to="/auth/login" className="text-decoration-none">
                      <Nav.Link className="btn btn-outline-primary">Login</Nav.Link>
                    </Link>
                    <Link to="/auth/register" className="text-decoration-none">
                      <Nav.Link className="btn btn-primary text-white">Sign Up</Nav.Link>
                    </Link>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ backgroundColor: '#f8f9fa' }} className="py-2 border-bottom">
          <Container fluid>
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard' }}>
                <Home size={14} className="me-1" />
                Home
              </Breadcrumb.Item>
              {breadcrumbs.map((item, index) => (
                <Breadcrumb.Item
                  key={index}
                  active={index === breadcrumbs.length - 1}
                  linkAs={Link}
                  linkProps={index < breadcrumbs.length - 1 ? { to: item.href } : undefined}
                >
                  {item.title}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Container>
        </div>
      )}

      <main className="flex-grow-1">{children}</main>
    </div>
  )
}