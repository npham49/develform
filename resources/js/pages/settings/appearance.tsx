import { Head } from '@inertiajs/react';
import { Palette, Monitor, Sun, Moon } from 'lucide-react';
import { Badge, Button, Card, Container } from 'react-bootstrap';

import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Appearance settings',
    href: '/settings/appearance',
  },
];

export default function Appearance() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appearance settings" />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Palette size={16} className="me-2" />
              Appearance Settings
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Customize Your Experience</h1>
            <p className="lead text-muted">
              Personalize your interface with themes and appearance preferences
            </p>
          </div>

          <SettingsLayout>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ width: 40, height: 40, backgroundColor: '#ede9fe' }}
                  >
                    <Palette size={20} className="text-purple" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Theme Preferences</h5>
                    <p className="text-muted small mb-0">Choose your preferred color scheme</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex gap-3">
                    <Card className="border-2 border-primary" style={{ width: '200px' }}>
                      <Card.Body className="p-3 text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                        >
                          <Sun size={20} className="text-primary" />
                        </div>
                        <h6 className="fw-bold mb-1">Light Theme</h6>
                        <p className="text-muted small mb-2">Bright and clean interface</p>
                        <Button variant="primary" size="sm" className="w-100">
                          Active
                        </Button>
                      </Card.Body>
                    </Card>

                    <Card className="border" style={{ width: '200px' }}>
                      <Card.Body className="p-3 text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 40, height: 40, backgroundColor: '#f3f4f6' }}
                        >
                          <Moon size={20} className="text-muted" />
                        </div>
                        <h6 className="fw-bold mb-1">Dark Theme</h6>
                        <p className="text-muted small mb-2">Easy on the eyes</p>
                        <Button variant="outline-secondary" size="sm" className="w-100">
                          Select
                        </Button>
                      </Card.Body>
                    </Card>

                    <Card className="border" style={{ width: '200px' }}>
                      <Card.Body className="p-3 text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 40, height: 40, backgroundColor: '#f3f4f6' }}
                        >
                          <Monitor size={20} className="text-muted" />
                        </div>
                        <h6 className="fw-bold mb-1">Auto</h6>
                        <p className="text-muted small mb-2">Matches system settings</p>
                        <Button variant="outline-secondary" size="sm" className="w-100">
                          Select
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h6 className="fw-semibold mb-2">Coming Soon</h6>
                    <p className="text-muted small mb-0">
                      Additional appearance customization options including custom colors, fonts, and layouts will be available in future updates.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </SettingsLayout>
        </Container>
      </div>
    </AppLayout>
  );
}
