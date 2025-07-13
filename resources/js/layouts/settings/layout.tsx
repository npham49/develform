import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { User, Lock, Palette } from 'lucide-react';
import { Card, Nav, Row, Col } from 'react-bootstrap';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: Lock,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: Palette,
  },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <Row className="g-4">
      <Col lg={3} md={4}>
        <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
          <Card.Header className="bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold">Settings</h5>
            <p className="text-muted small mb-0">Manage your account</p>
          </Card.Header>
          <Card.Body className="p-0">
            <Nav variant="pills" className="flex-column">
              {sidebarNavItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <Nav.Link
                    key={`${item.href}-${index}`}
                    as={Link}
                    href={item.href}
                    className={`d-flex align-items-center py-3 px-4 border-0 text-decoration-none ${
                      isActive 
                        ? 'bg-primary text-white' 
                        : 'text-muted hover-bg-light'
                    }`}
                    style={{ 
                      borderRadius: '0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {IconComponent && (
                      <IconComponent 
                        size={18} 
                        className={`me-3 ${isActive ? 'text-white' : 'text-muted'}`} 
                      />
                    )}
                    <span className="fw-medium">{item.title}</span>
                  </Nav.Link>
                );
              })}
            </Nav>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={9} md={8}>
        {children}
      </Col>
    </Row>
  );
}
