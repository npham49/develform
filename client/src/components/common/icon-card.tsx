import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface IconCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function IconCard({ icon: Icon, iconColor, iconBg, title, description, children, size = 'md' }: IconCardProps) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const containerSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;

  return (
    <div className="d-flex align-items-center">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
        style={{ width: containerSize, height: containerSize, backgroundColor: iconBg }}
      >
        <Icon size={iconSize} className={iconColor} />
      </div>
      <div>
        <h5 className="mb-0 fw-bold">{title}</h5>
        {description && <p className="text-muted small mb-0">{description}</p>}
        {children}
      </div>
    </div>
  );
}
