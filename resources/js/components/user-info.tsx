import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="rounded-circle overflow-hidden" style={{ width: '32px', height: '32px' }}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded bg-light text-dark">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="d-flex small flex-1 text-start">
        <span className="text-truncate fw-medium">{user.name}</span>
        {showEmail && <span className="text-truncate small text-muted">{user.email}</span>}
      </div>
    </>
  );
}
