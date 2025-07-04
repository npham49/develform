import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 fw-normal border-bottom">
        <div className="d-flex align-items-center gap-3 px-3 py-3">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="d-flex align-items-center w-100 px-3 py-2 text-decoration-none" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
            <Settings className="me-2" size={16} />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link className="d-flex align-items-center w-100 px-3 py-2 text-decoration-none text-danger" method="post" href={route('logout')} as="button" onClick={handleLogout}>
          <LogOut className="me-2" size={16} />
          Log out
        </Link>
      </DropdownMenuItem>
    </>
  );
}
