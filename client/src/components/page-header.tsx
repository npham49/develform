import type { LucideIcon } from 'lucide-react';
import { Badge } from 'react-bootstrap';

interface PageHeaderProps {
  badge?: {
    icon: LucideIcon;
    text: string;
    variant?: string;
  };
  title: string;
  description?: string;
}

export function PageHeader({ badge, title, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-5">
      {badge && (
        <Badge bg={badge.variant || 'secondary'} className="mb-3 d-inline-flex align-items-center">
          <badge.icon size={16} className="me-2" />
          {badge.text}
        </Badge>
      )}
      <h1 className="display-6 fw-bold text-dark">{title}</h1>
      {description && <p className="lead text-muted">{description}</p>}
    </div>
  );
}
