import { Globe, Lock } from 'lucide-react';
import { Badge } from 'react-bootstrap';

interface StatusBadgeProps {
  isPublic: boolean;
  size?: 'normal' | 'small';
}

export function StatusBadge({ isPublic, size = 'normal' }: StatusBadgeProps) {
  const iconSize = size === 'small' ? 10 : 12;
  const className = size === 'small' ? 'd-flex align-items-center small' : 'd-flex align-items-center';

  return isPublic ? (
    <Badge bg="success" className={className}>
      <Globe size={iconSize} className="me-1" />
      Public
    </Badge>
  ) : (
    <Badge bg="secondary" className={className}>
      <Lock size={iconSize} className="me-1" />
      Private
    </Badge>
  );
}
