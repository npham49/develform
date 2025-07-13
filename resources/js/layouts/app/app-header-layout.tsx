import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { 
  Home, 
  FileText, 
  Settings as SettingsIcon, 
  User, 
  LogOut, 
  Layers
} from 'lucide-react';
import { 
  Navbar, 
  Nav, 
  Container, 
  Dropdown,
  Breadcrumb
} from 'react-bootstrap';

export default function AppHeaderLayout({ 
  children, 
  breadcrumbs, 
  hideHeader 
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; hideHeader?: boolean }>) {
  const { auth } = usePage<SharedData>().props;

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideHeader && (
        <Navbar expand="lg" className="shadow-sm border-bottom" style={{ backgroundColor: '#ffffff' }}>
          <Container fluid>
            <Navbar.Brand as={Link} href="/" className="d-flex align-items-center text-decoration-none">
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
              <strong className="text-dark">Flowable Forms</strong>
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="navbar-nav" />
            
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} href="/dashboard" className="d-flex align-items-center text-muted fw-medium">
                  <Home size={16} className="me-2" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} href="/forms" className="d-flex align-items-center text-muted fw-medium">
                  <FileText size={16} className="me-2" />
                  Forms
                </Nav.Link>
              </Nav>
              
              <Nav className="d-flex align-items-center">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    className="text-decoration-none border-0 d-flex align-items-center p-2"
                    id="user-dropdown"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                        style={{ width: 32, height: 32, backgroundColor: '#dbeafe' }}
                      >
                        <User size={16} className="text-primary" />
                      </div>
                      <div className="d-none d-md-block text-start">
                        <div className="fw-semibold text-dark small">{auth?.user?.name}</div>
                        <div className="text-muted small">{auth?.user?.email}</div>
                      </div>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0">
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-semibold text-dark">{auth?.user?.name}</div>
                      <div className="text-muted small">{auth?.user?.email}</div>
                    </div>
                    <Dropdown.Item 
                      as={Link} 
                      href="/settings/profile" 
                      className="d-flex align-items-center py-2"
                    >
                      <User size={16} className="me-2 text-muted" />
                      Profile Settings
                    </Dropdown.Item>
                    <Dropdown.Item 
                      as={Link} 
                      href="/settings/appearance" 
                      className="d-flex align-items-center py-2"
                    >
                      <SettingsIcon size={16} className="me-2 text-muted" />
                      Preferences
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => router.post(route('logout'))}
                      className="d-flex align-items-center py-2 text-danger"
                    >
                      <LogOut size={16} className="me-2" />
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
          <Container fluid className="py-3">
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item as={Link} href="/dashboard" className="d-flex align-items-center text-decoration-none">
                <Home size={14} className="me-1" />
                Home
              </Breadcrumb.Item>
              {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item 
                  key={index} 
                  active={index === breadcrumbs.length - 1}
                  as={index === breadcrumbs.length - 1 ? 'span' : Link}
                  href={index === breadcrumbs.length - 1 ? undefined : breadcrumb.href}
                  className={index === breadcrumbs.length - 1 ? 'text-dark fw-medium' : 'text-decoration-none'}
                >
                  {breadcrumb.title}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Container>
        </div>
      )}

      <main className="flex-fill" style={{ backgroundColor: '#ffffff' }}>
        {children}
      </main>
    </div>
  );
}
