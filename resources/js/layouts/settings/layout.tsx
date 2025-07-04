import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: null,
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: null,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: null,
  },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Settings</h1>
        <p className="text-muted">Manage your profile and account settings</p>
      </div>

      <div className="row">
        <aside className="col-lg-3 col-md-4 mb-4">
          <nav className="nav flex-column">
            {sidebarNavItems.map((item, index) => (
              <Link key={`${item.href}-${index}`} href={item.href} className={`nav-link ${currentPath === item.href ? 'active bg-light' : ''}`}>
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <hr className="d-md-none my-4" />

        <div className="col-lg-9 col-md-8">
          <section className="max-w-xl">{children}</section>
        </div>
      </div>
    </div>
  );
}
