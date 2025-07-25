import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="sidebar-sticky">
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">Navigation</h6>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link" href="/forms">
                    Forms
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/settings">
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb" className="pt-3">
              <ol className="breadcrumb">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
                    {index === breadcrumbs.length - 1 ? breadcrumb.title : <a href={breadcrumb.href}>{breadcrumb.title}</a>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
