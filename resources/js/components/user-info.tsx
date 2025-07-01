import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="rounded-circle overflow-hidden" style={{ width: '36px', height: '36px' }}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded bg-primary text-white d-flex align-items-center justify-content-center">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="d-flex flex-column flex-1 text-start lh-1">
        <span className="text-truncate fw-semibold small">{user.name}</span>
        {showEmail && <span className="text-truncate text-muted" style={{ fontSize: '0.75rem' }}>{user.email}</span>}
      </div>
    </>
  );
}
