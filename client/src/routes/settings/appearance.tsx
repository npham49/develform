import { createFileRoute } from '@tanstack/react-router';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Card, Container } from 'react-bootstrap';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Appearance settings',
    href: '/settings/appearance',
  },
];

type Theme = 'light' | 'dark' | 'auto';

function SettingsAppearance() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    // TODO: Implement theme change logic
    console.log('Changing theme to:', theme);
  };

  const themes = [
    {
      id: 'light' as Theme,
      name: 'Light Theme',
      description: 'Bright and clean interface',
      icon: Sun,
      iconBg: '#dbeafe',
      iconColor: 'text-primary',
    },
    {
      id: 'dark' as Theme,
      name: 'Dark Theme',
      description: 'Easy on the eyes',
      icon: Moon,
      iconBg: '#f3f4f6',
      iconColor: 'text-muted',
    },
    {
      id: 'auto' as Theme,
      name: 'Auto',
      description: 'Matches system settings',
      icon: Monitor,
      iconBg: '#f3f4f6',
      iconColor: 'text-muted',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Palette size={16} className="me-2" />
              Appearance Settings
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Customize Your Experience</h1>
            <p className="lead text-muted">Personalize your interface with themes and appearance preferences</p>
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
                    {themes.map((theme) => {
                      const Icon = theme.icon;
                      const isActive = currentTheme === theme.id;

                      return (
                        <Card key={theme.id} className={`border-2 ${isActive ? 'border-primary' : 'border'}`} style={{ width: '200px' }}>
                          <Card.Body className="p-3 text-center">
                            <div
                              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                              style={{ width: 40, height: 40, backgroundColor: theme.iconBg }}
                            >
                              <Icon size={20} className={theme.iconColor} />
                            </div>
                            <h6 className="fw-bold mb-1">{theme.name}</h6>
                            <p className="text-muted small mb-2">{theme.description}</p>
                            <Button
                              variant={isActive ? 'primary' : 'outline-secondary'}
                              size="sm"
                              className="w-100"
                              onClick={() => handleThemeChange(theme.id)}
                            >
                              {isActive ? 'Active' : 'Select'}
                            </Button>
                          </Card.Body>
                        </Card>
                      );
                    })}
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

export const Route = createFileRoute('/settings/appearance')({
  loader: async () => {
    try {
      const response = await fetch('/api/user/appearance', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return { appearance: data.data || data };
      } else {
        // Return default appearance settings
        return {
          appearance: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
          },
        };
      }
    } catch (error) {
      console.error('Error fetching appearance settings:', error);
      return {
        appearance: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
        },
      };
    }
  },
  component: SettingsAppearance,
});
