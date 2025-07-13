import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default function AppHeaderLayout({ children, breadcrumbs, hideHeader }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; hideHeader?: boolean }>) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideHeader && (
        <header className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            <span
              className="d-inline-flex align-items-center justify-content-center bg-white text-primary rounded-circle me-2"
              style={{ height: '24px', width: '24px', fontSize: '12px' }}
            >
              FL
            </span>
            FlowableForms
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/forms">
                  Forms
                </Link>
              </li>
            </ul>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">Account</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => router.visit('/settings')}>Settings</Dropdown.Item>
                <Dropdown.Item onClick={() => router.post(route('logout'))}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
        </header>
      )}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="bg-light py-2">
          <div className="container-fluid">
            <ol className="breadcrumb mb-0">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
                  {index === breadcrumbs.length - 1 ? breadcrumb.title : <Link href={breadcrumb.href}>{breadcrumb.title}</Link>}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      <main className="flex-fill overflow-x-hidden">
        <div className="container-fluid py-3">{children}</div>
      </main>
    </div>
  );
}
