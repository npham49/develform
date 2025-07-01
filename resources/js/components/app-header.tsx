import { Breadcrumbs } from '@/components/breadcrumbs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ChevronDown, Folder, FormInput, LayoutGrid, Menu } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Forms',
    href: '/forms',
    icon: FormInput,
  },
];

const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const { auth } = usePage<SharedData>().props;
  const page = usePage();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <>
      {/* Main Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid px-4">
          {/* Brand/Logo */}
          <Link href="/dashboard" className="navbar-brand d-flex align-items-center">
            <AppLogo />
          </Link>

          {/* Mobile toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>

          {/* Navigation content */}
          <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
            {/* Main navigation items */}
            <ul className="navbar-nav me-auto">
              {mainNavItems.map((item) => (
                <li key={item.title} className="nav-item">
                  <Link
                    href={item.href}
                    className={`nav-link d-flex align-items-center gap-2 ${
                      page.url.startsWith(item.href) ? 'active' : ''
                    }`}
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right side items */}
            <ul className="navbar-nav">
              {/* External links */}
              {footerNavItems.map((item) => (
                <li key={item.title} className="nav-item">
                  <a
                    href={item.href}
                    className="nav-link d-flex align-items-center gap-2 text-muted"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon && <item.icon size={16} />}
                    <span className="d-none d-lg-inline">{item.title}</span>
                  </a>
                </li>
              ))}

              {/* User dropdown */}
              <li className="nav-item dropdown">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="nav-link btn btn-link d-flex align-items-center gap-2 text-dark p-2 border-0 bg-transparent">
                      <UserInfo user={auth.user} />
                      <ChevronDown size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dropdown-menu-end">
                    <UserMenuContent user={auth.user} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="bg-light border-bottom py-3">
          <div className="container-fluid px-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  );
}
